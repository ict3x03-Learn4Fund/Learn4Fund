pipeline {
    agent any
    stages {       

        stage("Test Build") {
            steps {                
                load '/var/jenkins_home/env/learn4fund.groovy'
                script{
                    try{
                        sh 'rm dependency-check-report.html'
                        sh 'rm dependency-check-report.xml'
                    }catch (err){
                        echo 'Skipping, no existing ODC reports present.'
                    }
                }
                dir('backend'){
                    script{
                        try{
                            sh 'rm package-lock.json'
                        }catch (err){
                            echo 'Skipping, no existing package-lock.json present.'
                        }
                    }
                }
                sh 'cp /home/.backend.env backend/.env'
                sh 'cp /home/.frontend.env frontend/.env'
                script{
                    try{                        
                        sh 'docker stop $(docker ps -a -q)'
                        sh 'docker rm $(docker ps -a -q)'
                    }catch (err){
                        echo 'Skipping, no existing containers present.'
                    }
                }
                sh 'docker system prune -a --force --volumes'
                sh 'docker compose -f docker-compose.dev.yml build --no-cache --pull'
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

        stage("Unit Testing"){
            steps{
                sh 'docker stop $(docker ps -a -q)' // Kill containers to run unit test
                sh 'docker rm $(docker ps -a -q)'
                dir('backend'){
                    sh 'npm i'
                    sh 'npm run test'
                }
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
                        -Dsonar.projectBaseDir=/var/jenkins_home/workspace/Learn4fund_final"
                        }
                }
            }
        }

        stage("OWASP Dependency Check") {
            steps {
                dependencyCheck additionalArguments: '--format HTML --format XML --disableYarnAudit --scan "/var/jenkins_home/workspace/Learn4fund_final/backend"', odcInstallation: 'Default' //--out /var/jenkins_home/workspace
            }
        }

        stage("Production Build") {
            steps {
                sh 'cp /home/.backend.env backend/.env'
                sh 'cp /home/.frontend.env frontend/.env'  
                dir('backend'){
                    script{
                        try{
                            sh 'rm package-lock.json'
                        }catch (err){
                            echo 'Skipping, no existing package-lock.json present.'
                        }
                    }
                }                            
                sh 'docker system prune -a --force --volumes'
                sh 'docker compose -f docker-compose.yml build --no-cache --pull'
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
