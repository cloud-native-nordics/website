workflow "Publish container" {
  on = "push"
  resolves = ["Push"]
}

action "Build" {
  uses = "./.github/actions/docker"
  secrets = ["DOCKER_IMAGE"]
  args = ["build", "Dockerfile"]
}

action "Login" {
  needs = ["Build"]
  uses = "actions/docker/login@master"
  secrets = ["DOCKER_USERNAME", "DOCKER_PASSWORD"]
}

action "Push" {
  needs = ["Login"]
  uses = "./.github/actions/docker"
  secrets = ["DOCKER_IMAGE"]
  args = "push"
}
