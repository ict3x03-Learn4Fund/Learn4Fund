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
        sh 'pwd'
//         sh 'cd /Learn4Fund/backend && npm i'
//         sh 'cd /Learn4Fund/frontend && npm i'
      }
    }

    stage('Test') {
      steps {
        sh 'echo "hi"'
      }
    }

//     stage('Deployment') {
//       steps {
//         sh 'cd /Learn4Fund/backend && npm i'
//         sh 'cd /Learn4Fund/frontend && npm i'
//       }
//     }

  }
  environment {
    CI = 'true'
  }
}
