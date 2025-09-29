helm install ingress-nginx ingress-nginx/ingress-nginx \
  --namespace ingress-basic --create-namespace \
  --set controller.service.type=LoadBalancer \
  --set controller.ingressClassResource.name=nginx \
  --set controller.ingressClassResource.controllerValue="k8s.io/ingress-nginx" \
  --set controller.ingressClass=nginx \
  --set controller.service.externalTrafficPolicy=Local \
  --set controller.service.annotations."service\.beta\.kubernetes\.io/oci-load-balancer-internal"="false" \
  --set controller.service.loadBalancerIP="52.250.216.186"