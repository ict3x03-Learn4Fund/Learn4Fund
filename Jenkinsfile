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
            // Install be packages
            sh 'pwd_path=$(pwd)'
            sh 'cd $pwd_path'
            sh 'cd backend && npm i'

            // Run backend
            sh 'npm run start &'

            // Install fe packages
            sh 'cd $pwd_path'
            sh 'cd frontend && npm i'

            // Run frontend
            sh 'npm run start &'
        }
    }
    stage('Deployment') {        
      parallel {
        stage('Deploy backend') {
        //   agent {
        //     docker {
        //       image 'node:lts-buster-slim'
        //       args '-p 3000:3000 -p 5000:5000'
        //     }
        //   }
          steps {
            sh 'pwd_path=$(pwd)'
            // sh 'cd $pwd_path'
            // sh 'cd backend && npm run start'
          }
        }
        stage('Deploy frontend') {
        //   agent {
        //     docker {
        //       image 'node:lts-buster-slim'
        //       args '-p 3000:3000 -p 5000:5000'
        //     }
        //   }
          steps {
            sh 'pwd_path=$(pwd)'
            // sh 'cd $pwd_path'
            // sh 'cd frontend && npm run start'
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
