from kubernetes import client, config

# Load Kubernetes configuration
config.load_kube_config()

# Create a Kubernetes API client
api_client = client.ApiClient()

# Define the Flask deployment
flask_deployment = client.V1Deployment(
    metadata=client.V1ObjectMeta(name="my-flask-app"),
    spec=client.V1DeploymentSpec(
        replicas=1,
        selector=client.V1LabelSelector(
            match_labels={"app": "my-flask-app"}
        ),
        template=client.V1PodTemplateSpec(
            metadata=client.V1ObjectMeta(
                labels={"app": "my-flask-app"}
            ),
            spec=client.V1PodSpec(
                containers=[
                    client.V1Container(
                        name="my-flask-container",
                        image="965647917252.dkr.ecr.us-east-1.amazonaws.com/my_monitoring_app_image:flask",
                        ports=[client.V1ContainerPort(container_port=5000)],
                        resources=client.V1ResourceRequirements(
                            requests={"cpu": "250m", "memory": "256Mi"},
                            limits={"cpu": "500m", "memory": "512Mi"}
                        )
                    )
                ]
            )
        )
    )
)

# Create the Flask deployment
apps_v1_api = client.AppsV1Api(api_client)
try:
    apps_v1_api.create_namespaced_deployment(
        namespace="default",
        body=flask_deployment
    )
    print("Flask deployment created successfully.")
except client.exceptions.ApiException as e:
    if e.status == 409:
        print("Flask deployment already exists.")
    else:
        print(f"Exception when creating Flask deployment: {e}")

# Define the Flask service
flask_service = client.V1Service(
    metadata=client.V1ObjectMeta(name="my-flask-service"),
    spec=client.V1ServiceSpec(
        selector={"app": "my-flask-app"},
        ports=[client.V1ServicePort(port=5000, target_port=5000)],
        type="LoadBalancer"
    )
)

# Create the Flask service
core_v1_api = client.CoreV1Api(api_client)
try:
    core_v1_api.create_namespaced_service(
        namespace="default",
        body=flask_service
    )
    print("Flask service created successfully.")
except client.exceptions.ApiException as e:
    if e.status == 409:
        print("Flask service already exists.")
    else:
        print(f"Exception when creating Flask service: {e}")

# Define the Next.js deployment
nextjs_deployment = client.V1Deployment(
    metadata=client.V1ObjectMeta(name="my-nextjs-app"),
    spec=client.V1DeploymentSpec(
        replicas=1,
        selector=client.V1LabelSelector(
            match_labels={"app": "my-nextjs-app"}
        ),
        template=client.V1PodTemplateSpec(
            metadata=client.V1ObjectMeta(
                labels={"app": "my-nextjs-app"}
            ),
            spec=client.V1PodSpec(
                containers=[
                    client.V1Container(
                        name="my-nextjs-container",
                        image="965647917252.dkr.ecr.us-east-1.amazonaws.com/my_monitoring_app_image:nextjs",
                        ports=[client.V1ContainerPort(container_port=3000)],
                        resources=client.V1ResourceRequirements(
                            requests={"cpu": "250m", "memory": "256Mi"},
                            limits={"cpu": "500m", "memory": "512Mi"}
                        )
                    )
                ]
            )
        )
    )
)

# Create the Next.js deployment
try:
    apps_v1_api.create_namespaced_deployment(
        namespace="default",
        body=nextjs_deployment
    )
    print("Next.js deployment created successfully.")
except client.exceptions.ApiException as e:
    if e.status == 409:
        print("Next.js deployment already exists.")
    else:
        print(f"Exception when creating Next.js deployment: {e}")

# Define the Next.js service
nextjs_service = client.V1Service(
    metadata=client.V1ObjectMeta(name="my-nextjs-service"),
    spec=client.V1ServiceSpec(
        selector={"app": "my-nextjs-app"},
        ports=[client.V1ServicePort(port=3000, target_port=3000)],
        type="LoadBalancer"
    )
)

# Create the Next.js service
try:
    core_v1_api.create_namespaced_service(
        namespace="default",
        body=nextjs_service
    )
    print("Next.js service created successfully.")
except client.exceptions.ApiException as e:
    if e.status == 409:
        print("Next.js service already exists.")
    else:
        print(f"Exception when creating Next.js service: {e}")