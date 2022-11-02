pipeline {
    agent any
    stages {       
        stage("Git Fetch") {
            steps {
                load '/var/jenkins_home/env/learn4fund.groovy'
                git branch: "test/vm", url: "https://${env.gitAccessToken}@github.com/ict3x03-Learn4Fund/Learn4Fund.git"
            }
        }

        stage("Test Build") {
            steps {                
                script{
                    try{
                        sh 'rm dependency-check-report.html'
                        sh 'rm dependency-check-report.xml'
                    }catch (err){
                        echo 'Skipping, ODC reports pre-generated.'
                    }
                }
                sh 'cp /home/.backend.env backend'
                sh 'cp /home/.frontend.env frontend'
                sh 'docker compose down --rmi all'
                sh 'docker system prune -a --force --volumes'
                sh 'docker compose -f docker-compose.dev.yml build --no-cache'
            }
        }

        stage("Test Deployment"){
            steps {
                sh 'docker compose -f docker-compose.dev.yml up --force-recreate -d'
            }
        }

        stage("UI Testing"){
            steps {
                sh 'echo "Waiting testing website to be up..."'
                sh 'sleep 60'
                sh 'python3 /home/test_linux.py'
            }
        }

        stage('SonarQube analysis') {
            tools {nodejs "node"}
            steps{
                script{
                    def scannerHome = tool 'sonarqube';
                    withSonarQubeEnv('sonarqube') {
                        sh "${scannerHome}/bin/sonar-scanner \
                        -D sonar.login=admin \
                        -D sonar.password=${env.sonarPassword} \
                        -D sonar.projectKey=sonarqube \
                        -D sonar.exclusions=vendor/**,resources/**,**/*.java \
                        -D sonar.host.url=http://128.199.99.77:9000/ \
                        -Dsonar.projectBaseDir=/var/jenkins_home/workspace/Learn4fund_main"
                        }
                }
            }
        }

        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit --scan "/var/jenkins_home/workspace/Learn4fund_main/backend"', odcInstallation: 'Default' //--out /var/jenkins_home/workspace
            }
        }

        stage("Production Build") {
            steps {
                script{
                    try{
                        sh 'rm dependency-check-report.html'
                        sh 'rm dependency-check-report.xml'
                    }catch (err){
                        echo 'Skipping, ODC reports pre-generated.'
                    }
                }
                sh 'cp /home/.backend.env backend'
                sh 'cp /home/.frontend.env frontend'                              
                sh 'docker compose down --rmi all'
                sh 'docker system prune -a --force --volumes'
                sh 'docker compose -f docker-compose.yml build --no-cache'
            }
        }

        stage("Production Deployment"){
            steps {
                sh 'docker compose -f docker-compose.yml up --force-recreate -d'
            }
        }

    }
    post {
        success {
            script{
                dependencyCheckPublisher pattern: 'dependency-check-report.xml'
            }                        
        }
    }
}
