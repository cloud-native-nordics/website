<template>
  <v-container fluid v-if="meetup">
    <v-row>
      <v-col fill-height class="pt-5 pb-5" cols="6">
        <v-row>
          <v-col cols="12">
            <headline :text="meetup.name" :size="'xs12'"></headline>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row v-if="meetup.presentations != undefined && meetup.presentations.length > 0">
      <v-col class="pt-5 pb-5" cols="12" lg="6">
        <v-row v-if="organizers != undefined && organizers.length > 0">
          <v-col cols="12">
            <organizers :organizers="organizers"></organizers>
          </v-col>
        </v-row>
        <v-row  v-if="speakers != undefined && speakers.length > 0">
          <v-col cols="12">
            <speakers :speakers="speakers"></speakers>
          </v-col>
        </v-row>
        <v-row v-if="meetup.sponsors != undefined ">
          <v-col cols="12">
            <h3>Sponsors</h3>
            <v-row v-for="role in sponsorRoles" :key="role">
              <v-col>
                <h3>{{role}}</h3>
                <v-row class="pr-5 pl-5">
                  <v-col
                    v-for="sponsor in companiesInTier(role)"
                    :key="sponsor.id"
                    cols="6"
                    sm="6"
                    md="6"
                    lg="6"
                  >
                    <v-card text>
                      <v-card-title>
                        <v-img
                          v-bind:class="{ darkLogo: sponsor.company.whiteLogo }"
                          contain
                          :src="sponsor.company.logoURL"
                          height="100px"
                          class="clickable-image"
                          @click="navigate(`/company/${sponsor.company.id}`)"
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
          </v-col>
        </v-row>
      </v-col>
      <v-col class="pt-5 pb-5" cols="12" lg="6">
        <v-row>
          <v-col cols="12">
            <v-col cols="12">
              <h3>Agenda</h3>
            </v-col>
            <v-timeline>
              <v-timeline-item
                v-for="presentation in sortedPresentations"
                :key="presentation.id"
                large
              >
                <template v-slot:icon>
                  <v-avatar>
                    <v-img
                      v-if="presentation.speakers[0] != undefined"
                      :src="githubAvatar(presentation.speakers[0].github)"
                    />
                    <v-img v-else :src="githubAvatar('')" />
                  </v-avatar>
                </template>
                <template v-slot:opposite>
                  <span>{{presentation.duration}}</span>
                </template>
                <template v-slot:default>
                  <h4>{{presentation.title}}</h4>
                </template>
              </v-timeline-item>
            </v-timeline>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </v-container>
</template>

<script>
import headline from "~/components/common/Headline";
import organizers from "~/components/meetup-groups/organizers";
import speakers from "~/components/company/speakers";
import event from "~/graphql/event.gql";
export default {
  components: {
    headline: headline,
    organizers: organizers,
    speakers: speakers
  },
  apollo: {
    meetup: {
      query: event,
      variables() {
        return { id: this.$route.params.id };
      }
    }
  },
  computed: {
    speakers() {
      let speakers = [];

      this.meetup.presentations.forEach(presentation => {
        let time = presentation.duration.substring(0, 2);
        let duration = parseInt(time);
        if (duration > 15) {
          if (presentation.speakers) {
            presentation.speakers.forEach(speaker => {
              if (!speakers.includes(speaker)) {
                speakers.push(speaker);
              }
            });
          }
        }
      });
      return speakers;
    },
    organizers() {
      let speakers = [];

      this.meetup.presentations.forEach(presentation => {
        let time = presentation.duration.substring(0, 2);
        let duration = parseInt(time);
        if (duration <= 15) {
          if (presentation.speakers) {
            presentation.speakers.forEach(speaker => {
              if (!speakers.includes(speaker)) {
                speakers.push(speaker);
              }
            });
          }
        }
      });
      return speakers;
    },
    sortedPresentations() {
      return this.meetup.presentations.reverse();
    },
    sponsorRoles() {
      let tiers = [];
      this.meetup.sponsors.forEach(sponsor => {
        if (!tiers.includes(sponsor.role)) {
          tiers.push(sponsor.role);
        }
      });
      return tiers;
    }
  },
  methods: {
    githubAvatar(githubId) {
      if (githubId == "") {
        return "/no-image.png";
      }
      return "https://github.com/" + githubId + ".png?size=200";
    },
    companiesInTier(role) {
      return this.meetup.sponsors.filter(sponsor => sponsor.role === role);
    }
  }
};
</script>