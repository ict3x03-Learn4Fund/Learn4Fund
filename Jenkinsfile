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
        git(url: 'https://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@github.com/ict3x03-Learn4Fund/Learn4Fund.git', branch: 'test/vm')
        dir(path: '/Learn4Fund/backend') {
          sh 'npm install'
        }

        dir(path: '/Learn4Fund/frontend') {
          sh 'npm install'
        }

      }
    }

    stage('Test') {
      steps {
        sh 'echo "hi"'
      }
    }

    stage('Deployment') {
      steps {
        dir(path: '/Learn4Fund/backend') {
          sh 'npm run start'
        }

        dir(path: '/Learn4Fund/frontend') {
          sh 'npm run start'
        }

      }
    }

  }
  environment {
    CI = 'true'
  }
}
