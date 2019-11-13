<template>
  <div>
    <v-row>
      <v-col>
        <h3>Sponsorings</h3>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('Longterm')">
      <v-col>
        <h3>Longterm sponsors of</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="meetupGroup in meetupGroupsInTier('Longterm')"
            :key="meetupGroup.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  contain
                  :src="meetupGroup.photo"
                  height="200px"
                ></v-img>
              </v-card-title>

              <v-card-text>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="meetupGroup.name"
                    :to="'/meetup-groups/'+meetupGroup.meetupID"
                  >{{meetupGroup.name}}</router-link>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('Meetup')">
      <v-col>
        <h3>Meetup sponsored at</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="meetupGroup in meetupGroupsInTier('Meetup')"
            :key="meetupGroup.meetupID"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  contain
                  :src="meetupGroup.photo"
                  height="200px"
                ></v-img>
              </v-card-title>

              <v-card-text>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="meetupGroup.name"
                    :to="'/meetup-groups/'+meetupGroup.meetupID"
                  >{{meetupGroup.name}}</router-link>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('SpeakerProvider')">
      <v-col>
        <h3>Speakers provided to</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="meetupGroup in meetupGroupsInTier('SpeakerProvider')"
            :key="meetupGroup.meetupID"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  contain
                  :src="meetupGroup.photo"
                  height="200px"
                ></v-img>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <span class="text--primary .text-no-wrap">
                      <router-link
                        v-if="meetupGroup.name"
                        :to="'/meetup-groups/'+meetupGroup.meetupID"
                      >{{meetupGroup.name}}</router-link>
                    </span>
                  </v-col>
                </v-row>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <!-- <v-row v-if="tiers.includes('EcosystemMember')">
      <v-col>
        <h3>Members of</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="meetupGroup in meetupGroupsInTier('EcosystemMember')"
            :key="meetupGroup.meetupID"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  contain
                  :src="meetupGroup.photo"
                  height="200px"
                ></v-img>
              </v-card-title>

              <v-card-text>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="meetupGroup.name"
                    :to="'/meetup-groups/'+meetupGroup.meetupID"
                  >{{meetupGroup.name}}</router-link>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
export default {
  props: ["sponsorings"],
  computed: {
    tiers() {
      let tiers = [];
      this.sponsorings.forEach(sponsoring => {
        if (!tiers.includes(sponsoring.tier)) {
          tiers.push(sponsoring.tier);
        }
      });
      return tiers;
    }
  },
  methods: {
    meetupGroupsInTier(tier) {
      let meetupGroups = []
      let tiers = this.sponsorings.filter(sponsoring => sponsoring.tier === tier);
      tiers.forEach(tier => {
        meetupGroups.push(tier.meetupGroups[0])
      });
      return meetupGroups;
    }
  }
};
</script>

<style lang="scss" scoped>
.member-text {
  font-size: 14px;
  color: #512268;
  text-decoration: none;
}
</style>