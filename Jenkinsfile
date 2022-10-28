node {
checkout scm
docker.image('node:lts-buster-slim')withRun('-p 5000:5000 -p 3000:3000').inside {
    stage('Build') {
        sh 'pwd_path=$(pwd)'
        sh 'cd $pwd_path'
        sh 'cd backend && npm i'
        sh 'cd $pwd_path'
        sh 'cd frontend && npm i'
    }
    stage('Deploy frontend') {
        sh 'pwd_path=$(pwd)'
        sh 'cd $pwd_path'
        sh 'cd frontend && npm run start'
    }
    stage('Deploy backend') {
        sh 'pwd_path=$(pwd)'
        sh 'cd $pwd_path'
        sh 'cd backend && npm run start'
    }
}
}
