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
        dir(path: '/var/jenkins_home/workspace/Learn4fund_github') {
          git(url: 'https://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@github.com/ict3x03-Learn4Fund/Learn4Fund.git', branch: 'test/vm')
          sh 'echo hi'
          sh 'cd backend && npm i'
          sh 'cd frontend && npm i'
        }

      }
    }

    stage('Test') {
      steps {
        sh 'echo "test4"'
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
