// Repostiory Model File
'use strict';

// Mongoose package requirement
var mongoose = require('mongoose');

// Schema definition
var Schema = mongoose.Schema;

// if config is prefixed to the field it means we will be getting it from
// the individiual project's config file(if they provide one.)
var repositorySchema = new Schema({
  name              : { type: String, maxlength: 100 },
  full_name         : { type: String, unique: true },
  description       : { type: String, maxlength: 100 },
  html_url          : { type: String },
  contributors_url  : { type: String },
  created_at        : { type: Date },
  updated_at        : { type: Date },
  pushed_at         : { type: Date },
  homepage          : { type: String },
  size              : { type: Number },
  stargazers_count  : { type: Number },
  watchers_count    : { type: Number },
  language          : { type: String },
  forks_count       : { type: Number },
  subscribers_count : { type: Number },
  config : {
    config_date        : { type: String},
    config_description : { type: String },
    config_images      : [{type: String}],

     // Github API only includes 1 primary language for repo
    config_tags: [{type: String}],
    contributors: [{
      config_full_name: { type: String },
      config_role: { type: String },
    }],
  }
});

// Export Schema
module.exports = mongoose.model('Repository', repositorySchema);
