pipeline {
    agent any
    stages {
        stage('Test') {
            steps {
                script {
                    docker.image('node:lts-buster-slim')
                    .withRun('-p 5000:5000 -p 3000:3000'){
                        sh script: """
                        pwd_path=$(pwd)
                        cd $pwd_path
                        cd backend && npm i
                        cd $pwd_path
                        cd frontend && npm i

                        pwd_path=$(pwd)
                        cd $pwd_path
                        cd frontend && npm run start &

                        pwd_path=$(pwd)
                        cd $pwd_path
                        cd backend && npm run start &
                        """
                    }
                }
            }
        }
    }
}
