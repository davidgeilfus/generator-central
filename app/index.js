'use strict';

var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var chalk = require('chalk');

module.exports = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
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

  writing: {
    git: function () {
      this.copy('gitattributes', '.gitattributes');
      this.copy('gitignore', '.gitignore');
    },

    packageJSON: function () {
      this.template('_package.json', 'package.json');
    },

    gruntfile: function () {
      this.template('_Gruntfile.js', 'Gruntfile.js');
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

      this.write('bower.json', JSON.stringify(bower, null, 2));
    },

    app: function () {
      // Copy the /app directory
      this.directory('app', 'app');

      this.mkdir('app/assets/stylesheets');
      this.mkdir('app/assets/javascripts');
      this.mkdir('app/assets/images');

      this.template('_index.html', 'app/index.html');
    },

    jshint: function () {
      this.copy('jshintrc', '.jshintrc');
    },

    editorconfig: function () {
      this.copy('editorconfig', '.editorconfig');
    },

    readme: function () {
      this.copy('_README.md', 'README.md');
    }
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
