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

    stage('OWASP DependencyCheck') {
        agent any
        steps {
            dependencyCheck(odcInstallation: 'Default', additionalArguments: '--format HTML --format XML')
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
            // Backend
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd backend && npm i && npm run start &'

            // Frontend
            sh 'cd $pwd_path'
            sh 'cd frontend && npm i && npm run start'

        }
    }
    stage('Test'){
        agent any
        steps {
            sh 'echo "Testing..."'
        }
    }

    }
    environment {
    CI = 'true'
    }

    post {
    success {
        dependencyCheckPublisher(pattern: 'dependency-check-report.xml')
        }
    }
}
