const express = require('express');

const Users = require("./userDb");
const Posts = require("../posts/postDb");

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  // do your magic!
  res.status(201).json(req.body);
});

router.post('/:id/posts', validatePost, (req, res) => {
  // do your magic!
  res.status(201).json(req.body);
});

router.get('/', (req, res) => {
  // do your magic!
  Users.get()
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({ message: "There were no users to be found." });
      } else {
        res.status(200).json(data);
      }
    })
    .catch(data => {
      res.status(500).json({ error: "Something went wrong." })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  res.status(200).json(req.user);
});

router.get('/:id/posts', validateUserId, (req, res) => {
  // do your magic!
  Users.getUserPosts(req.user.id)
    .then(data => {
      res.status(200).json(data);
    })
    .catch(data => {
      res.status(500).json({ error: "Something went wrong." })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  // do your magic!
  Users.remove(req.user.id)
    .then(data => {
      if (data.length === 0) {
        res.status(404).json({ message: "User does not exist." })
      } else {
        res.status(200).json("User has been deleted.");
      }
    })
    .catch(data => {
      res.status(500).json({ error: "Something went wrong." })
    })
});

router.put('/:id', validateUserId, (req, res) => {
  // do your magic!
  if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    Users.update(req.user.id, req.body)
      .then(data => {
        Users.getById(req.params.id)
          .then(user => {
            res.status(200).json(user);
          })
      })
      .catch(data => {
        res.status(500).json({ error: "Something went wrong." });
      })
  }
});

//custom middleware

function validateUserId(req, res, next) {
  // do your magic!
  Users.getById(req.params.id)
    .then(data => {
      if (!data) {
        res.status(400).json({ message: "invalid user id" });
      } else {
        req.user = data;
      }
      next();
    })
    .catch(data => res.status(500).json({ error: "Something went wrong." }))
}

function validateUser(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing user data" });
  } else if (!req.body.name) {
    res.status(400).json({ message: "missing required name field" });
  } else {
    Users.insert(req.body)
      .then(data => {
        req.body = data;
        next();
      })
      .catch(data => {
        res.status(500).json({ error: "Something went wrong." })
      })
  }
}

function validatePost(req, res, next) {
  // do your magic!
  if (!req.body) {
    res.status(400).json({ message: "missing post data" });
  } else if (!req.body.text) {
    res.status(400).json({ message: "missing required text field" });
  } else {
    Posts.insert({ ...req.body, user_id: req.params.id })
      .then(data => {
        req.post = data;
        next();
      })
      .catch(data => {
        console.log(data);
        res.status(500).json({ error: "Something went wrong." })
      })
  }
}

module.exports = router;