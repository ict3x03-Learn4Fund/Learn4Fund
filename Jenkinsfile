pipeline {
    agent none
    stages {        
        stage("Git Fetch") {
            agent any
            steps {
                git branch: "test/vm", url: "https://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@github.com/ict3x03-Learn4Fund/Learn4Fund.git"
                // Copy env file to backend.
                sh 'pwd_path=$(pwd)'
                sh 'cd $pwd_path'
                sh 'cd backend && cp /home/.env .'
            }
        }

        stage("Build") {
            agent {
                docker {
                    image 'node:lts-buster-slim'
                    args '-p 3000:3000 -p 5000:5000'
                    reuseNode true
                }
            }
            steps {
                // npm install backend
                sh 'pwd_path=$(pwd)'
                sh 'cd $pwd_path'
                sh 'cd backend && npm i'

                // npm intall frontend
                sh 'cd $pwd_path'
                sh 'cd frontend && npm i --verbose'
            }
        }

        stage('SonarQube analysis') {
            agent any
            tools {nodejs "node"}
            steps{
                script{
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner \
                        -D sonar.login=admin \
                        -D sonar.password=123 \
                        -D sonar.projectKey=sonarqubetest \
                        -D sonar.exclusions=vendor/**,resources/**,**/*.java \
                        -D sonar.host.url=http://10.104.16.20:9000/"
                        }
                }
            }
        }

        stage("OWASP Dependency Check") {
            agent any
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit --scan "/var/jenkins_home/workspace/Learn4Fund/backend', odcInstallation: 'Default'
            }
        }

        stage("Deploy"){
            agent {
            docker {
                image 'node:lts-buster-slim'
                args '-p 3000:3000 -p 5000:5000'
                reuseNode true
            }
            }
            steps {
                // Deploy Backend
                sh 'pwd_path=$(pwd)'
                sh 'cd $pwd_path'
                sh 'cd backend && npm run start &'

                // Deploy Frontend
                sh 'cd $pwd_path'
                sh 'cd frontend && npm run start'
            }
        }
    }
    post {
        success {
            dependencyCheckPublisher pattern: 'dependency-check-report.xml'
        }
    }
}
