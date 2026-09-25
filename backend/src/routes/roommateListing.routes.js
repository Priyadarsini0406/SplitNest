const router=require("express").Router();
const c=require("../controllers/roommateListing.controller");
const {protect,requireRole}=require("../middlewares/auth.middleware");
router.get("/public",c.listPublic);
router.get("/owner",protect,requireRole("owner"),c.listOwner);
router.post("/",protect,requireRole("owner"),c.create);
router.delete("/:id",protect,requireRole("owner"),c.remove);
module.exports=router;
