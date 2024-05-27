import {
  BACKPACK_CONFIG_VERSION,
  BACKPACK_GITHUB_LINK,
  BACKPACK_HELP_AND_SUPPORT,
  BACKPACK_LINK,
  BACKPACK_TERMS_OF_SERVICE,
  DISCORD_INVITE_LINK,
  TWITTER_LINK,
} from "@coral-xyz/common";
import { useTranslation } from "@coral-xyz/i18n";
import {
  BackpackTextLogo,
  DiscordIcon,
  List,
  ListItem,
  RedBackpack,
  XTwitterIcon,
} from "@coral-xyz/react-common";
import {
  temporarilyMakeStylesForBrowserExtension,
  useTheme,
  YStack,
} from "@coral-xyz/tamagui";
import { GitHub } from "@mui/icons-material";
import { Typography } from "@mui/material";

import { ScreenContainer } from "../../../components/ScreenContainer";
import type {
  Routes,
  SettingsScreenProps,
} from "../../../navigation/SettingsNavigator";

export function AboutScreen(props: SettingsScreenProps<Routes.AboutScreen>) {
  return (
    <ScreenContainer loading={<Loading />}>
      <Container {...props} />
    </ScreenContainer>
  );
}

function Loading() {
  // TODO.
  return null;
}

function Container(_props: SettingsScreenProps<Routes.AboutScreen>) {
  const theme = useTheme();
  const { t } = useTranslation();

  const menuItems = [
    {
      label: t("help_ampersand_support"),
      url: BACKPACK_HELP_AND_SUPPORT,
    },
    {
      label: t("website"),
      url: BACKPACK_LINK,
    },
    {
      label: t("terms_of_service"),
      url: BACKPACK_TERMS_OF_SERVICE,
    },
  ];

  const handleOpenURL = (url: string) => window.open(url, "_blank");

  return (
    <YStack>
      <div style={{ marginBottom: "35px" }}>
        {/* <RedBackpack
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "32px auto",
            marginBottom: 4,
          }}
        />
        <div
          style={{
            textAlign: "center",
            marginTop: 22,
          }}
        >
          <BackpackTextLogo />
        </div> */}
        <svg
          style={{
            display: "flex",
            justifyContent: "center",
            margin: "32px auto",
            marginBottom: 4,
          }}
          width="300"
          height="74"
          viewBox="0 0 209 52"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M100.125 8.79829L86.7472 31.0444V41.3505H78.0461V31.0067L64.6686 8.79829H73.9087L81.9829 22.5984H82.7979L90.9096 8.79829H100.112H100.125Z"
            fill="white"
          />
          <path
            d="M128.798 37.605C125.488 40.8225 121.138 42.4312 115.747 42.4312C110.355 42.4312 106.005 40.8225 102.682 37.605C99.36 34.3875 97.6925 30.2147 97.6925 25.0743C97.6925 19.9338 99.3475 15.7233 102.657 12.5184C105.967 9.31344 110.33 7.71725 115.747 7.71725C121.163 7.71725 125.476 9.32601 128.798 12.5184C132.108 15.7233 133.763 19.9086 133.763 25.0743C133.763 30.2399 132.108 34.4 128.798 37.605ZM115.747 34.8776C118.43 34.8776 120.661 33.9727 122.454 32.1628C124.247 30.353 125.137 27.9901 125.137 25.0743C125.137 22.1584 124.247 19.7578 122.454 17.9605C120.661 16.1632 118.43 15.2709 115.747 15.2709C113.064 15.2709 110.794 16.1632 109.026 17.9605C107.246 19.7578 106.356 22.1332 106.356 25.0743C106.356 28.0153 107.246 30.3907 109.026 32.188C110.807 33.9853 113.051 34.8776 115.747 34.8776Z"
            fill="white"
          />
          <path
            d="M136.271 41.3505V8.79829H146.363L160.004 29.2597H160.781V8.79829H169.282V41.3505H159.427L145.586 20.8891H144.771V41.3505H136.271Z"
            fill="white"
          />
          <path
            d="M199.171 41.3505L197.353 36.2729H182.045L180.227 41.3505H171.225L183.6 8.79829H195.811L208.186 41.3505H199.184H199.171ZM184.364 29.7247H195.034L190.508 17.018H188.928L184.364 29.7247Z"
            fill="white"
          />
          <path
            d="M40.7131 0.0502737L31.3601 0L36.488 29.7997C36.9142 32.2883 38.6319 34.3495 40.9889 35.2167L54.2913 40.0933L58.9928 31.9866L46.3675 27.3238C45.7783 27.1101 45.352 26.5948 45.2392 25.9664L40.7131 0.0502737Z"
            fill="#5BFEC8"
          />
          <path
            d="M30.1778 14.0135L27.6954 0.0374298H18.3424L20.6744 13.3223C20.7872 13.9381 20.549 14.5665 20.0726 14.9813L0 31.9235L4.65143 40.0553L27.7706 20.6371C29.7014 19.0158 30.6167 16.4895 30.1778 14.0135Z"
            fill="#5BFEC8"
          />
          <path
            d="M23.8716 33.0564C21.5145 32.1892 18.8691 32.6542 16.9383 34.2755L6.08081 43.4002L10.7322 51.532L21.0632 42.8849C21.5396 42.4827 22.2041 42.3696 22.7933 42.5833L47.4547 51.5948L52.1688 43.5008L23.859 33.0815L23.8716 33.0564Z"
            fill="#5BFEC8"
          />
        </svg>

        <Typography
          style={{ color: theme.baseTextMedEmphasis.val, textAlign: "center" }}
        >
          {BACKPACK_CONFIG_VERSION}
        </Typography>
      </div>
      {menuItems.map((item, idx) => (
        <List
          key={idx}
          style={{
            border: `${theme.baseBorderLight.val}`,
            borderRadius: "10px",
            marginBottom: "8px",
          }}
        >
          <ListItem
            key={item.label}
            isFirst={idx === 0}
            isLast={idx === menuItems.length - 1}
            onClick={() => handleOpenURL(item.url)}
            style={{
              borderRadius: "10px",
              height: "44px",
              padding: "12px",
            }}
          >
            <Typography
              style={{ fontWeight: 500, fontSize: "16px", lineHeight: "24px" }}
            >
              {item.label}
            </Typography>
          </ListItem>
        </List>
      ))}
      <div style={{ marginTop: 24 }}>
        <SocialMediaRow />
      </div>
    </YStack>
  );
}

const socialMediaItems = [
  {
    label: "X",
    onClick: () => window.open(TWITTER_LINK, "_blank"),
    icon: (props: any) => <XTwitterIcon {...props} />,
  },
  {
    label: "Discord",
    onClick: () => window.open(DISCORD_INVITE_LINK, "_blank"),
    icon: (props: any) => <DiscordIcon {...props} />,
  },
  {
    label: "Github",
    onClick: () => window.open(BACKPACK_GITHUB_LINK, "_blank"),
    icon: (props: any) => <GitHub {...props} />,
  },
];

const SocialMediaRow: React.FC = () => {
  const theme = useTheme();
  const classes = useStyles();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {socialMediaItems.map((item) => (
        <div
          key={item.label}
          className={classes.icon}
          onClick={item.onClick}
          style={{ cursor: "pointer", margin: "0 12px" }}
        >
          <item.icon
            fill={theme.baseIcon.val}
            style={{ color: theme.baseIcon.val }}
            size={item.label === "X" ? 27 : 22}
          />
        </div>
      ))}
    </div>
  );
};

const useStyles = temporarilyMakeStylesForBrowserExtension(() => ({
  icon: {
    "&:hover": {
      opacity: 0.8,
    },
  },
}));
