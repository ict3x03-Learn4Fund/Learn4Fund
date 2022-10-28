pipeline {
  agent none
  stages {
    stage('Deleting') {
        agent any
        steps {
            script{
                try{
                    sh 'docker stop $(docker ps -q)'
                }catch (err){
                    echo 'No running containers.'
                }
            }
            
        }
    }
    stage('Build') {
        agent {
        docker {
            image 'node:lts-buster-slim'
            args '-p 3000:3000 -p 5000:5000'
            reuseNode true
        }
        }            
        steps {
            // be
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd backend && npm i && npm run start &'

            // fe
            sh 'cd $pwd_path'
            sh 'cd frontend && npm i && npm run start'

        }
    }

  }
  environment {
    CI = 'true'
  }

}
