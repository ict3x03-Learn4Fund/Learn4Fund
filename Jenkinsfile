pipeline {
  agent {
    docker {
      image 'node:lts-buster-slim'
      args '-p 3000:3000 -p 5000:5000'
    }

  }
  stages {
    stage('Build') {
      steps {
        sh 'pwd_path=$(pwd)'
        sh 'cd $pwd_path'
        sh 'cd backend && npm i'
        sh 'cd $pwd_path'
        sh 'cd frontend && npm i'
      }
    }

    stage('OWASP DependencyCheck') {
      steps {
        dependencyCheck(odcInstallation: 'Default')
      }
    }

    stage('Deployment') {
      parallel {
        stage('Deploy backend') {
          steps {
            sh 'cd $pwd_path'
            sh 'cd backend && npm run start'
          }
        }

        stage('Deploy frontend') {
          steps {
            sh 'cd $pwd_path'
            sh 'cd frontend && npm run start'
          }
        }

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
