import mixpanel from "mixpanel-browser";

const ENV = process.env.NEXT_PUBLIC_ENV;
const MIXPANEL_TOKEN = process.env.NEXT_PUBLIC_MIXPANEL_TOKEN;

export const init = () => {
  if (!MIXPANEL_TOKEN) {
    console.warn("Mixpanel token is missing.");
    return;
  }

  mixpanel.init(MIXPANEL_TOKEN, {
    debug: ENV === "development",
    autocapture: false,
  });
};

export const identify = (distinct_id: string, props?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;

  mixpanel.identify(distinct_id);

  if (props) {
    mixpanel.people.set(props);
  }
};

export const set_people_properties = (properties: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;

  mixpanel.people.set(properties);
};

export const track = (event: string, props?: Record<string, any>) => {
  if (!MIXPANEL_TOKEN) return;

  mixpanel.track(event, props);
};

export const reset = () => {
  if (!MIXPANEL_TOKEN) return;

  mixpanel.reset();
};
