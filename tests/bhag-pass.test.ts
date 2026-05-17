import type { HookValue } from "../src/type/template";
import { makeWysiwyv } from "../src/wysiwyv";
import { assertSuccess } from "../test-util";

describe("big hairy template matches big hairy data", () => {
  const data: HookValue = {
    store_id: "a3f1b2c4-d5e6-7890-abcd-ef1234567890",
    store_name: "Velodrome Supply Co.",
    last_updated: "2026-05-07T14:32:00Z",
    contact: {
      email: "orders@velodromesupply.com",
      phone: "619-555-0142",
    },
    departments: ["Bicycles", "Accessories", "Apparel"],
    inventory: [
      {
        sku: "550e8400-e29b-41d4-a716-446655440000",
        category: "bicycle",
        name: "Apex Trail 29er",
        in_stock: true,
        quantity: 12,
        price_usd: 1299.99,
        added: "2025-11-15T08:00:00-08:00",
        tags: ["mountain", "hardtail", "29er"],
        specs: {
          frame_material: "aluminum",
          wheel_size_in: 29,
          gears: 21,
          weight_kg: 13.2,
        },
      },
      {
        sku: "6ba7b810-9dad-11d1-80b4-00c04fd430c8",
        category: "accessory",
        name: "Kryptonite New York Lock",
        in_stock: true,
        quantity: 47,
        price_usd: 89.95,
        added: "2026-05-15 23:09:59Z",
        tags: ["security", "lock", "u-lock"],
        specs: {
          weight_kg: 1.4,
          length_mm: 203,
          security_rating: "gold",
        },
      },
      {
        sku: "6ba7b811-9dad-11d1-80b4-00c04fd430c8",
        category: "apparel",
        name: "Castelli Endurance Jersey",
        in_stock: false,
        quantity: 1,
        price_usd: 139.0,
        added: "2026-01-20T11:00:00-08:00",
        tags: ["jersey", "road", "mens"],
        specs: {
          material: "polyester",
          sizes_available: ["S", "M", "L", "XL"],
          weight_kg: 0.18,
        },
      },
    ],
    manager: {
      id: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
      name: "Imelda Cruz",
      email: "imelda@velodromesupply.com",
      since: "20230601T080000Z",
    },
    audit: {
      created_by: "sys-init",
      record_id: "a3f1b2c4-d5e6-7890-abcd-ef1234567890",
      version: 8,
      confirmed: true,
      lawsuits: null,
    },
    locations: [
      { store: "0000", id: "00000000-0000-0000-0000-000000000000" },
      { store: 1111, id: "14154bce-50f1-11f1-ab07-0242ac120002" },
      { store: 4444, id: "5e39add7-9371-44ad-9a1e-5aeab239c767" },
      { store: 7777, id: "019e2f7d-7bbd-749a-9fdf-fb0464d123e0" },
      { store: "FFFF", id: "ffffffff-ffff-ffff-ffff-ffffffffffff" },
    ],
  };

  const template: HookValue = {
    store_id: { $and: ["$uuid", { $val: "store_ref" }] },
    store_name: "Velodrome Supply Co.",
    last_updated: { $and: ["$isodate", "$any"] },
    contact: {
      email: "$email",
      phone: "619-555-0142",
    },
    inventory: {
      $array: {
        $minlength: 1,
        $each: {
          sku: { $and: ["$uuid", "$string"] },
          category: "$string",
          name: "$string",
          in_stock: "$bool",
          quantity: { $int: { $min: 1 } },
          price_usd: "$number",
          added: { $or: ["$isodate", "$strictisodate"] },
          tags: {
            $array: {
              $minlength: 1,
              $each: "$string",
            },
          },
          specs: {
            $and: [
              {
                $object: { $partial: { weight_kg: "$number" } },
              },
              {
                $plainobject: {
                  $eachElement: {
                    $or: ["$number", "$string", { $array: "$string" }],
                  },
                },
              },
            ],
          },
        },
      },
    },
    manager: {
      id: "$uuid",
      name: "$string",
      email: "$email",
      since: "$basicisodate",
    },
    audit: {
      created_by: "$string",
      record_id: { $val: "store_ref" },
      version: 8,
      confirmed: true,
      lawsuits: null,
    },
    departments: {
      $and: [
        { $array: "$string" }, // each element is a string
        ["Bicycles", "Accessories", "Apparel"], // exact tuple
      ],
    },
    locations: [
      { $object: { $partial: { id: { $uuid: 0 } } } },
      { $object: { $partial: { id: { $uuid: 1 } } } },
      { $object: { $partial: { id: { $uuid: 4 } } } },
      { $object: { $partial: { id: { $uuid: 7 } } } },
      { $object: { $partial: { id: { $uuid: "F" } } } },
    ],
  };

  it("matches", () => {
    const wyv = makeWysiwyv();
    const result = wyv.validate(template, data);
    assertSuccess(result);
  });
});
