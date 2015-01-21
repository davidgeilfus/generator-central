'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  init: function () {
    this.pkg = require('../package.json');
  },

  askFor: function () {
    var done = this.async();

    // Have Yeoman greet the user
    this.log(yosay(
      'Welcome to ' + chalk.red('Central’s generator') + ' ladies and gentlemen. Let’s start a new project…'
    ));

    var prompts = [
      {
        type:    'input',
        name:    'appname',
        message: 'What’s your project name?',
        default: this._.slugify(this.appname) // Default to the current folder name
      },
      {
        type:    'confirm',
        name:    'useBootstrap',
        message: 'Would you like to include Bootstrap for Sass?',
        default: true
      },
      {
        type:    'confirm',
        name:    'useModernizr',
        message: 'Would you like to include Modernizr?',
        default: true
      }
    ];

    this.prompt(prompts, function (answers) {
      this.appname = answers.appname;
      this.useBootstrap = answers.useBootstrap;
      this.useModernizr = answers.useModernizr;

      done();
    }.bind(this));
  },

  git: function () {
    this.fs.copy(
      this.templatePath('gitattributes'),
      this.destinationPath('.gitattributes')
    );
    this.fs.copy(
      this.templatePath('gitignore'),
      this.destinationPath('.gitignore')
    );
  },

  packageJSON: function () {
    this.fs.copyTpl(
      this.templatePath('_package.json'),
      this.destinationPath('package.json'),
      {
        appname: this.appname
      }
    );
  },

  gruntfile: function () {
    if (this.useBootstrap) {
      this.gruntfile.insertConfig('sass', "{ dist: { files: { '': '' } } }");

      this.gruntfile.registerTask('default', ['sass']);
    }
  },

  bowerJSON: function () {
    var bower = {
      name: this._.slugify(this.appname),
      dependencies: {}
    };

    if (this.useBootstrap) {
      bower.dependencies['bootstrap-sass-official'] = "~3.3.3";
    } else {
      bower.dependencies.jquery = "~1.11.2";
    }

    if (this.useModernizr) {
      bower.dependencies.modernizr = "~2.8.3";
    }

    this.fs.writeJSON('bower.json', bower);
  },

  src: function () {
    this.mkdir('src');
    this.mkdir('src/assets/stylesheets');
    this.mkdir('src/assets/javascripts');
    this.mkdir('src/assets/images');

    this.fs.copyTpl(
      this.templatePath('_index.html'),
      this.destinationPath('src/index.html'),
      {
        appname: this.appname,
        useBootstrap: this.useBootstrap,
        useModernizr: this.useModernizr
      }
    );
  },

  jshint: function () {
    this.fs.copy(
      this.templatePath('jshintrc'),
      this.destinationPath('.jshintrc')
    );
  },

  editorconfig: function () {
    this.fs.copy(
      this.templatePath('editorconfig'),
      this.destinationPath('.editorconfig')
    );
  },

  readme: function () {
    this.fs.copy(
      this.templatePath('_README.md'),
      this.destinationPath('README.md')
    );
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
