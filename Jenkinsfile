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
                          mv Deployment/server.yaml Deployment/deploy.yaml.tmp
                          cat Deployment/deploy.yaml.tmp | envsubst > Deployment/server.yaml
                          rm -f Deployment/deploy.yaml.tmp
                          mv Deployment/client.yaml Deployment/deploy.yaml.tmp
                          cat Deployment/deploy.yaml.tmp | envsubst > Deployment/client.yaml
                          rm -f Deployment/deploy.yaml.tmp
                          kubectl apply -f Deployment --kubeconfig ${KUBECONFIG}
                        """
                     }
                
                }
            }
    }
}