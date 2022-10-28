pipeline {
  agent none
  stages {
    stage('Build') {
      agent {
        docker {
          image 'node:lts-buster-slim'
          args '-p 3000:3000 -p 5000:5000'
        }
      }
      steps {
        sh 'pwd_path=$(pwd)'
        sh 'cd $pwd_path'
        sh 'cd backend && npm i'
        sh 'cd $pwd_path'
        sh 'cd frontend && npm i'
      }
    }
    stage('Deployment') {
      parallel {
        stage('Deploy backend') {
          agent {
            docker {
              image 'node:lts-buster-slim'
               //args '-p 3000:3000 -p 5000:5000'
            }
          }
          steps {
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd backend && npm run start'
          }
        }
        stage('Deploy frontend') {
          agent {
            docker {
              image 'node:lts-buster-slim'
               //args '-p 3000:3000 -p 5000:5000'
            }
          }
          steps {
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd frontend && npm run start'
          }
        }
//         stage('OWASP DependencyCheck') {
//           agent any
//           steps {
//             dependencyCheck(odcInstallation: 'Default', additionalArguments: '--format HTML --format XML')
//           }
//         }
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
