pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    docker.image('node:lts-buster-slim')
                    .withRun('-p 5000:5000 -p 3000:3000'){
                        sh 'pwd_path=$(pwd)'
                        sh 'cd $pwd_path'
                        sh 'cd backend && npm i'
                        sh 'cd $pwd_path'
                        sh 'cd frontend && npm i'

                        sh 'pwd_path=$(pwd)'
                        sh 'cd $pwd_path'
                        sh 'cd frontend && npm run start &'

                        sh 'pwd_path=$(pwd)'
                        sh 'cd $pwd_path'
                        sh 'cd backend && npm run start &'
                    }
                }
            }
        }
    }
}
