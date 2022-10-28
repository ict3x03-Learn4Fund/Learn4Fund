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
            // Backend
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd backend && npm i'

            // Frontend
            sh 'cd $pwd_path'
            sh 'cd frontend && npm i'
        }
    }

    stage('OWASP DependencyCheck') {
        agent any
        steps {
            dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit', odcInstallation: 'Default'
        }
    }

    stage('Deploy'){
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
            sh 'cd backend && npm run start &'

            // Frontend
            sh 'cd $pwd_path'
            sh 'cd frontend && npm run start'
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
