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
          width="300"
          height="68"
          viewBox="0 0 756 172"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M115.853 125.933C114.849 123.287 112.569 121.554 110.014 121.372C64.1294 118.544 22.9881 111.063 22.9881 102.215C22.9881 97.5625 34.2084 93.8224 51.4495 90.9945C53.8213 90.6296 55.6457 88.2578 55.3721 85.5211C55.0984 82.6932 52.7266 80.7775 50.3548 81.1424C19.6128 86.8894 0 95.2819 0 104.769C0 119.456 47.7094 131.771 110.927 134.416C114.758 134.599 117.495 130.129 115.944 126.115C115.853 126.024 115.853 126.024 115.853 125.933Z"
            fill="#FF7A00"
          />
          <path
            d="M224.59 81.3249C222.127 80.8688 219.847 82.7844 219.573 85.7035C219.299 88.349 221.124 90.7208 223.495 91.1769C240.736 94.0048 251.957 97.7449 251.957 102.397C251.957 111.246 210.815 118.726 164.931 121.554C162.376 121.736 160.096 123.47 159.092 126.115C159.092 126.115 159.092 126.206 159.001 126.206C157.45 130.22 160.096 134.69 164.018 134.508C227.236 131.862 274.945 119.547 274.945 104.86C274.945 95.2819 255.332 86.8894 224.59 81.3249Z"
            fill="#FF7A00"
          />
          <path
            d="M203.336 88.4402C211.182 88.1665 210.817 79.1355 206.438 78.4969C156.539 71.9289 143.586 66.3643 143.495 4.05938C143.495 3.60327 143.312 3.05595 143.13 2.59984C141.488 -0.866614 136.288 -0.866614 134.646 2.59984C134.372 3.05595 134.281 3.60327 134.281 4.05938C134.737 62.8067 118.317 72.0201 68.4184 78.4969C64.0397 79.0443 62.945 88.2577 71.5199 88.4402C114.851 89.17 132.457 98.6571 134.281 168.625C134.281 169.719 135.102 170.632 136.014 171.179C137.747 172.274 140.119 172.274 141.853 171.179C142.765 170.54 143.586 169.719 143.586 168.625C145.319 98.6571 158.637 89.8997 203.336 88.4402Z"
            fill="#FF7A00"
          />
          <path
            d="M303.318 42.2816C304.686 42.2816 305.69 42.8289 306.328 43.8324L339.989 89.2612L373.833 43.8324C374.471 42.8289 375.475 42.2816 376.843 42.2816H393.354C393.993 42.2816 394.449 42.5553 394.723 43.1026C394.996 43.6499 394.905 44.1973 394.449 44.8358L349.203 103.492V127.666C349.203 129.49 348.29 130.403 346.466 130.403H332.874C330.958 130.403 329.955 129.49 329.955 127.666V103.492L285.256 44.8358C284.8 44.2885 284.708 43.6499 284.982 43.1026C285.165 42.5553 285.712 42.2816 286.442 42.2816H303.318Z"
            fill="#FF7A00"
          />
          <path
            d="M472.719 42.2816C479.104 42.2816 484.486 42.9202 489.047 44.1061C493.517 45.292 497.166 47.2988 499.994 49.8531C502.822 52.4985 504.829 55.8738 506.106 60.07C507.383 64.2662 508.022 69.3747 508.022 75.3954V97.0151C508.022 103.036 507.383 108.235 506.106 112.432C504.829 116.628 502.822 120.094 499.994 122.74C497.166 125.385 493.517 127.301 489.047 128.487C484.577 129.673 479.104 130.22 472.719 130.22H433.767C427.381 130.22 421.999 129.673 417.529 128.487C413.059 127.301 409.41 125.385 406.673 122.74C403.846 120.094 401.839 116.628 400.47 112.432C399.193 108.235 398.555 103.036 398.555 97.0151V75.3954C398.555 69.3747 399.193 64.2662 400.47 60.07C401.747 55.8738 403.846 52.4073 406.673 49.8531C409.501 47.2076 413.15 45.292 417.529 44.1061C421.999 42.9202 427.381 42.2816 433.767 42.2816H472.719ZM417.803 95.8292C417.803 99.1132 418.076 101.85 418.624 104.039C419.171 106.229 420.083 108.053 421.36 109.33C422.637 110.607 424.279 111.519 426.469 112.067C428.567 112.614 431.304 112.888 434.588 112.888H471.989C475.273 112.888 478.009 112.614 480.108 112.067C482.206 111.519 483.939 110.607 485.216 109.33C486.493 108.053 487.405 106.229 487.953 104.039C488.5 101.85 488.774 99.022 488.774 95.8292V76.9462C488.774 73.6622 488.5 70.9255 487.953 68.7361C487.405 66.5468 486.493 64.7223 485.216 63.4452C483.939 62.1681 482.297 61.2559 480.108 60.7085C478.009 60.1612 475.273 59.8875 471.989 59.8875H434.588C431.304 59.8875 428.567 60.1612 426.469 60.7085C424.371 61.2559 422.637 62.1681 421.36 63.4452C420.083 64.7223 419.171 66.5468 418.624 68.7361C418.076 70.9255 417.803 73.7534 417.803 76.9462V95.8292Z"
            fill="#FF7A00"
          />
          <path
            d="M543.687 42.2816C545.694 42.2816 547.336 42.3728 548.704 42.5553C550.072 42.7377 551.258 43.1026 552.262 43.65C553.265 44.1973 554.269 44.9271 555.181 45.9305C556.093 46.934 557.188 48.2111 558.374 49.7618L605.171 111.246C605.536 111.793 606.083 112.158 606.813 112.158H607.907C608.546 112.158 608.911 111.702 608.911 110.881V45.2007C608.911 43.3763 609.823 42.464 611.648 42.464H624.875C626.699 42.464 627.611 43.3763 627.611 45.2007V117.358C627.611 122.466 626.699 125.933 624.875 127.757C623.05 129.582 620.131 130.494 616.3 130.494H605.444C603.529 130.494 601.887 130.403 600.61 130.22C599.333 130.038 598.147 129.673 597.143 129.217C596.14 128.669 595.136 127.94 594.224 127.027C593.221 126.024 592.126 124.747 590.849 123.105L543.869 61.6208C543.322 61.0734 542.775 60.7085 542.227 60.7085H541.133C540.494 60.7085 540.129 61.1646 540.129 61.9857V127.666C540.129 129.49 539.217 130.403 537.392 130.403H524.165C522.249 130.403 521.246 129.49 521.246 127.666V55.4177C521.246 50.3092 522.158 46.8427 523.983 45.0183C525.807 43.1938 528.726 42.2816 532.558 42.2816H543.687Z"
            fill="#FF7A00"
          />
          <path
            d="M699.227 42.2816C702.42 42.2816 705.065 42.9202 707.254 44.1973C709.444 45.4744 711.542 48.0286 713.64 51.86L755.329 127.575C755.785 128.396 755.876 129.125 755.602 129.673C755.42 130.22 754.781 130.494 753.778 130.494H737.814C736.354 130.494 735.442 129.946 734.895 128.852L725.955 112.614H666.843L658.177 128.852C657.629 129.946 656.626 130.494 655.258 130.494H638.929C637.834 130.494 637.196 130.22 637.013 129.673C636.831 129.125 636.922 128.396 637.287 127.575L678.611 51.86C680.709 48.1199 682.807 45.5656 684.814 44.1973C686.821 42.9202 689.192 42.2816 691.838 42.2816H699.227ZM674.779 97.9273H718.11L698.132 61.0734C697.767 60.5261 697.311 60.1612 696.764 60.1612H696.034C695.487 60.1612 694.939 60.4349 694.666 61.0734L674.779 97.9273Z"
            fill="#FF7A00"
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
