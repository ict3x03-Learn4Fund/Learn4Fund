pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    docker.image('node:lts-buster-slim').withRun('-p 5000:5000 -p 3000:3000'){ c ->
                        sh 'cd backend && npm i'
                        // sh script: """
                        // cd backend && npm i
                        // cd frontend && npm i
                        // cd frontend && npm run start &
                        // cd backend && npm run start &
                        // """
                    }
                }
            }
        }
    }
}
