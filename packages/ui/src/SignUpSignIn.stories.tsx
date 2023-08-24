import { Meta } from "@storybook/react";

import { SignUpSignInComponent } from "./SignUpSignIn";

export default {
  title: "components/SignUpSignIn",
  component: SignUpSignInComponent,
  argTypes: { 
    type: {
      options: ["sign-up", "sign-in"],
      control: {
        type: "radio"
      }
    },
    handleOAuthWithPress: { action: "handleOAuthWithPress" },
    handleEmailWithPress: { action: "handleEmailWithPress" }
  },
} satisfies Meta<typeof SignUpSignInComponent>;

export const SignIn = {
  args: {
    type: "sign-in",
  },
};

export const SignUp = {
  args: {
    type: "sign-up",
  },
};