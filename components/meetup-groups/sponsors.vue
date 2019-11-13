<template>
  <div>
    <v-row>
      <v-col>
        <h3>Sponsors</h3>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('Longterm')">
      <v-col>
        <h3>Longterm Sponsors</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="sponsor in companiesInTier('Longterm')"
            :key="sponsor.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  v-bind:class="{ darkLogo: sponsor.company.whiteLogo }"
                  contain
                  :src="sponsor.company.logoURL"
                  height="200px"
                ></v-img>
              </v-card-title>

              <v-card-text>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="sponsor.company.name"
                    :to="'/company/'+sponsor.company.id"
                  >{{sponsor.company.name}}</router-link>
                </span>
                <br />
                <span class="text--primary">
                  <a :href="sponsor.company.websiteURL">Website</a>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('Meetup')">
      <v-col>
        <h3>Meetup Sponsors</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="sponsor in companiesInTier('Meetup')"
            :key="sponsor.id"
            cols="12"
            sm="6"
            md="6"
            lg="4"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  v-bind:class="{ darkLogo: sponsor.company.whiteLogo }"
                  contain
                  :src="sponsor.company.logoURL"
                  height="200px"
                ></v-img>
              </v-card-title>

              <v-card-text>
                <span class="text--primary .text-no-wrap">
                  <router-link
                    v-if="sponsor.company.name"
                    :to="'/company/'+sponsor.company.id"
                  >{{sponsor.company.name}}</router-link>
                </span>
                <br />
                <span class="text--primary">
                  <a :href="sponsor.company.websiteURL">Website</a>
                </span>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
    <v-row v-if="tiers.includes('SpeakerProvider')">
      <v-col>
        <h3>Speaker providers</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="sponsor in companiesInTier('SpeakerProvider')"
            :key="sponsor.id"
            cols="6"
            sm="4"
            md="4"
            lg="2"
          >
            <v-card text>
              <v-card-title>
                <v-img
                  v-bind:class="{ darkLogo: sponsor.company.whiteLogo }"
                  contain
                  :src="sponsor.company.logoURL"
                  height="100px"
                ></v-img>
              </v-card-title>
              <v-card-text>
                <v-row>
                  <v-col cols="12">
                    <span class="text--primary .text-no-wrap">
                      <router-link
                        v-if="sponsor.company.name"
                        :to="'/company/'+sponsor.company.id"
                      >{{sponsor.company.name}}</router-link>
                    </span>
                    <br />
                    <span class="text--primary">
                      <a :href="sponsor.company.websiteURL">Website</a>
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
        <h3>Ecosystem Members</h3>
        <v-row class="pr-5 pl-5">
          <v-col
            v-for="sponsor in companiesInTier('EcosystemMember')"
            :key="sponsor.id"
            cols="4"
            sm="3"
            md="3"
            lg="2"
          >
            <span class="text--primary">
              <router-link
                class="member-text"
                v-if="sponsor.company.name"
                :to="'/company/'+sponsor.company.id"
              >{{sponsor.company.name}}</router-link>
            </span>
          </v-col>
        </v-row>
      </v-col>
    </v-row> -->
  </div>
</template>

<script>
export default {
  props: ["sponsors"],
  computed: {
    tiers() {
      let tiers = [];
      this.sponsors.forEach(sponsor => {
        if (!tiers.includes(sponsor.tier)) {
          tiers.push(sponsor.tier);
        }
      });
      return tiers;
    }
  },
  methods: {
    companiesInTier(tier) {
      return this.sponsors.filter(sponsor => sponsor.tier === tier);
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