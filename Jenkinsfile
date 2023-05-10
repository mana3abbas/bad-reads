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
                            docker build -t monasamir/client:v${BUILD_NUMBER} $WORKSPACE/badreads-frontend/Dockerfile
                            docker push monasamir/client:v${BUILD_NUMBER}
                       """
                   }
                }
            }
        }
        stage('deploy') {
            steps {
                 
                     withCredentials([file(credentialsId: 'kubeconfig-credi', variable: 'KUBECONFIG')]) 
                     {
                      sh """
                          mv deployment/server.yaml deployment/deploy.yaml.tmp
                          cat deployment/deploy.yaml.tmp | envsubst > deployment/server.yaml
                          rm -f deployment/deploy.yaml.tmp
                          mv deployment/client.yaml deployment/deploy.yaml.tmp
                          cat deployment/deploy.yaml.tmp | envsubst > deployment/client.yaml
                          rm -f deployment/deploy.yaml.tmp
                          kubectl apply -f deployment --kubeconfig ${KUBECONFIG}
                        """
                     }
                
            }
        }
    }
}
