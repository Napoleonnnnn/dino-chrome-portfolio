var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// api/journey/index.ts
var journey_exports = {};
__export(journey_exports, {
  default: () => handler
});
module.exports = __toCommonJS(journey_exports);

// api/_lib/prisma.ts
var import_client = require("@prisma/client");
var globalForPrisma = globalThis;
var prisma = globalForPrisma.prisma ?? new import_client.PrismaClient();
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// api/_lib/auth.ts
var import_jsonwebtoken = __toESM(require("jsonwebtoken"), 1);
var JWT_SECRET = process.env.JWT_SECRET || "change-me-in-production";
function verifyAuth(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return null;
  const token = authHeader.substring(7);
  try {
    const decoded = import_jsonwebtoken.default.verify(token, JWT_SECRET);
    return decoded;
  } catch {
    return null;
  }
}
function requireAuth(req, res) {
  const auth = verifyAuth(req);
  if (!auth) {
    res.status(401).json({ error: "Unauthorized" });
    return false;
  }
  return true;
}
function setCorsHeaders(res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
}
function handleCors(req, res) {
  setCorsHeaders(res);
  if (req.method === "OPTIONS") {
    res.status(200).end();
    return true;
  }
  return false;
}

// api/journey/index.ts
async function handler(req, res) {
  if (handleCors(req, res)) return;
  switch (req.method) {
    case "GET":
      return getJourneys(req, res);
    case "POST":
      return createJourney(req, res);
    default:
      return res.status(405).json({ error: "Method not allowed" });
  }
}
async function getJourneys(req, res) {
  const showAll = req.query.all === "true";
  if (showAll && !requireAuth(req, res)) return;
  const journeys = await prisma.journey.findMany({
    where: showAll ? {} : { isPublished: true },
    include: {
      images: {
        orderBy: { order: "asc" }
      }
    },
    orderBy: [
      { order: "asc" },
      { date: "desc" }
    ]
  });
  return res.status(200).json(journeys);
}
async function createJourney(req, res) {
  if (!requireAuth(req, res)) return;
  const { title, slug, summary, content, date, location, coverImage, order, isPublished } = req.body || {};
  if (!title || !slug || !summary || !date) {
    return res.status(400).json({
      error: "title, slug, summary, and date are required"
    });
  }
  const existing = await prisma.journey.findUnique({ where: { slug } });
  if (existing) {
    return res.status(409).json({ error: `Slug "${slug}" already exists` });
  }
  const journey = await prisma.journey.create({
    data: {
      title,
      slug,
      summary,
      content: content || null,
      date: new Date(date),
      location: location || null,
      coverImage: coverImage || null,
      order: order ?? 0,
      isPublished: isPublished ?? true
    },
    include: { images: true }
  });
  return res.status(201).json(journey);
}
