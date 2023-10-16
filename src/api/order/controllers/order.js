// @ts-nocheck
const stripe = require("stripe")(process.env.STRIPE_KEY);

("use strict");

/**
 * order controller
 */

const { createCoreController } = require("@strapi/strapi").factories;

module.exports = createCoreController("api::order.order", ({ strapi }) => ({
  async create(ctx) {
    const { cart } = ctx.request.body;
    if (!cart) {
      ctx.response.status = 400;
      return { error: "Cart is required" };
    }
    const lineItems = await Promise.all(
      cart.map(async (product) => {
        const item = await strapi
          .service("api::product.product")
          .findOne(product.id);
        return {
          price_data: {
            currency: "usd",
            product_data: {
              name: item.title,
            },
            unit_amount: item.price * 100,
          },
          quantity: product.amount,
        };
      })
    );
    try {
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ["card"],
        line_items: lineItems,
        mode: "payment",
        success_url: `${process.env.CLIENT_URL}?success=true`,
        cancel_url: `${process.env.CLIENT_URL}?success=false`,
        shipping_address_collection: { allowed_countries: ["US", "CA"] },
      });
      await strapi.service("api::order.order").create({
        data: {
          products: cart,
          stripeId: session.id,
        },
      });
      return { stripeSession: session };
    } catch (error) {
      ctx.response.status = 500;
    }
  },
}));
