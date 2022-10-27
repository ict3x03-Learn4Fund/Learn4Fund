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
          sh 'pwd'
        dir(path: '/var/jenkins_home/workspace/Learn4fund_github') {
          sh 'cd backend && npm i'
          sh 'cd frontend && npm i'
        }

      }
    }

    stage('Test') {
      steps {
        sh 'echo "test3"'
      }
    }

    stage('Deployment') {
      parallel {
        stage('Deploy backend') {
          steps {
            sh 'cd /var/jenkins_home/workspace/Learn4fund_github/backend && npm run start'
          }
        }

        stage('Deploy frontend') {
          steps {
            sh 'cd /var/jenkins_home/workspace/Learn4fund_github/frontend && npm run start'
          }
        }

      }
    }

  }
  environment {
    CI = 'true'
  }
}
