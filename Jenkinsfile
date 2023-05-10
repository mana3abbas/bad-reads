pipeline {
    agent { label 'jenkins-slave' }
    stages {
        stage('build') {
            steps {
                script {
                   withCredentials([usernamePassword(credentialsId: 'dockerhubaccount', usernameVariable: 'USERNAME', passwordVariable: 'PASSWORD')]) 
                    {
                       sh """
                            docker login -u $USERNAME -p $PASSWORD
                            docker build -t monasamir/server:v${BUILD_NUMBER} -f $WORKSPACE/badreads-backend/Dockerfile  
                            docker push monasamir/server:v${BUILD_NUMBER} 
                       """
                   
                       sh """
                            docker login -u $USERNAME -p $PASSWORD
                            docker build -t monasamir/client:v${BUILD_NUMBER} -f $WORKSPACE/badreads-frontend/Dockerfile  
                            docker push monasamir/client:v${BUILD_NUMBER}
                       """
                   }
                
            }
        }
        stage('deploy') {
            steps {
                 
                     withCredentials([file(credentialsId: 'kubeconfig-credi', variable: 'KUBECONFIG')]) {
                      sh """
                         helm install vois${BUILD_NUMBER} onboard-task $WORKSPACE/HELM/onboard-task
                        """
                     }
                
                }
            }
        }
    }
}
