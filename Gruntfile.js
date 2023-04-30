module.exports = function(grunt) {

    grunt.loadNpmTasks('grunt-screeps');

    grunt.initConfig({
        screeps: {
            options: {
                email: 'joshua.klarich@gmail.com',
                token: '925dd9df-aa2e-40ef-9b73-28cbd91a8b06',
                branch: 'blue',
                //server: 'season'
            },
            dist: {
                src: ['dist/*.js']
            }
        }
    });
}
