pipeline {
    agent none
    stages {
        stage('OWASP DependencyCheck') {
            agent any
            steps {
                dependencyCheck(odcInstallation: 'Default', additionalArguments: '--format HTML --format XML')
            }
        }
        stage ('Build'){
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
        stage('Parallel Deployment') {
            agent { 
                docker {
                    image 'node:lts-buster-slim'
                    args '-p 3000:3000 -p 5000:5000'
                } 
            }
            stages {
                stage('frontend & Backend') {
                    parallel {
                        stage('frontend') 
                        { 
                            steps {
                                sh 'cd $pwd_path'
                                sh 'cd backend && npm run start'
                            } 
                        } 
                        stage('backend') { 
                            steps {
                                sh 'cd $pwd_path'
                                sh 'cd backend && npm run start'
                            }
                        }
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
