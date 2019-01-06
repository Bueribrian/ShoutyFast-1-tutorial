const path = require("path");
const { randomNumber } = require("../helpers/libs");
const fs = require("fs-extra");
const { Image, Comment } = require("../models/index");
const md5 = require("md5");
const ctrl = {};
const sidebar = require('../helpers/sidebar')

ctrl.index = async (req, res) => {
	let viewModel = { image: {}, comments: {}}
 	 const image = await Image.findOne({ filename: { $regex: req.params.image_id } });
	if (image) {
		image.views = image.views + 1;
		viewModel.image = image
		await image.save();
		const comments = await Comment.find({ image_id: image._id });
		viewModel.comments = comments
    viewModel = await sidebar(viewModel)
    console.log(viewModel.sidebar.popular)
		res.render("image", viewModel);
	}else{
		res.redirect('/')
	}
};

ctrl.create = (req, res) => {
  const saveImage = async () => {
    const imgUrl = randomNumber();
    const images = await Image.find({ filename: imgUrl });
    if (images.length > 0) {
      saveImage();
    } else {
      console.log(imgUrl);
      const imageTempPath = req.file.path;
      const ext = path.extname(req.file.originalname).toLowerCase();
      const targetPath = path.resolve(`src/public/upload/${imgUrl}${ext}`);

      if (
        ext === ".png" ||
        ext === ".jpg" ||
        ext === ".jpeg" ||
        ext === ".gif"
      ) {
        await fs.rename(imageTempPath, targetPath);
        let { title, description } = req.body;
        let newImage = new Image({
          title: title,
          description: description,
          filename: imgUrl + ext
        });
        await newImage.save(err => {
          if (err) throw err;
          res.redirect("/images/" + imgUrl);
        });
      } else {
        await fs.unlink(imageTempPath);
        res
          .status(500)
          .render("messageError", {
            msg: 'Only ".jpg - .jpeg - .png -.gif" are allowed '
          });
      }
    }
  };
  saveImage();
};

ctrl.like = async(req, res) => {
	const image = await Image.findOne({filename: {$regex: req.params.image_id}})
	if(image){
		image.likes = image.likes + 1
		await image.save()
		res.json({likes:image.likes})
	}else{
		res.status(500).json({error : 'Internal Error'})
	}
};

ctrl.comment = async (req, res) => {
  const image = await Image.findOne({
    filename: { $regex: req.params.image_id }
  });
  if (image) {
    const newComment = new Comment(req.body);
    newComment.gravatar = md5(newComment.email);
    newComment.image_id = image._id;
    newComment.save(err => {
      if (err) throw err;
      res.redirect("/images/" + image.uniqueId);
    });
  }else{
	  res.redirect('/')
  }
};

ctrl.remove = async(req, res) => {
	let img = await Image.findOne({filename:{$regex:req.params.image_id}})
	console.log(img.filename)
	if(img){
		await fs.unlink(path.resolve('./src/public/upload/'+img.filename))
		console.log(img)
		let comment = await Comment.deleteMany({image_id: img._id})
		if(comment){
			await img.remove()
			console.log(comment)
			res.json({true:true})
		}else{
			res.status(404).json({msg:'Ups ocurrio un error'})
		}
		
	}
	
};
module.exports = ctrl;
