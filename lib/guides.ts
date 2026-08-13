export type GuideCategory =
  | 'Compatibility'
  | 'App Versions'
  | 'Android Basics'
  | 'Safe Downloads';

export interface Guide {
  slug: string;
  title: string;
  description: string;
  category: GuideCategory;
  readTime: string;
  publishedAt: string;
  updatedAt: string;
  sections: {
    heading: string;
    paragraphs: string[];
  }[];
}

export const guides: Guide[] = [
  {
    slug: 'how-to-check-android-app-compatibility',
    title: 'How to Check Android App Compatibility',
    description:
      'Learn how to check whether an Android app is compatible with your device and Android version before installing it.',
    category: 'Compatibility',
    readTime: '5 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'What does Android app compatibility mean?',
        paragraphs: [
          'Android app compatibility determines whether an application can run correctly on a particular Android device and operating system version.',
          'Compatibility can depend on the minimum Android version required by the app, device architecture, available hardware features and other technical requirements.',
        ],
      },
      {
        heading: 'Check your Android version',
        paragraphs: [
          'Open your device Settings and look for the Android version information. The exact location can vary between manufacturers.',
          'Once you know your Android version, you can compare it with the minimum Android version required by the application.',
        ],
      },
      {
        heading: 'Use DroidZyra Compatibility Finder',
        paragraphs: [
          'DroidZyra provides a Compatibility Finder that helps you compare an application with your Android version.',
          'Open the Compatibility Finder, select an application and choose your Android version to see the available compatibility information.',
        ],
      },
      {
        heading: 'Why an app may not be compatible',
        paragraphs: [
          'An application may be incompatible because your Android version is too old, the required architecture is unavailable, or the application depends on hardware or system features that your device does not provide.',
          'Compatibility information can also change when developers release newer application versions.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-find-the-right-android-app-version',
    title: 'How to Find the Right Version of an Android App',
    description:
      'Learn how Android app versions work and how to identify the version that is appropriate for your device.',
    category: 'App Versions',
    readTime: '5 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'Why app versions matter',
        paragraphs: [
          'Android applications are updated regularly. New versions can introduce features, security improvements, performance changes and compatibility requirements.',
          'The newest version is not always compatible with every older Android device, which makes version information useful when troubleshooting compatibility.',
        ],
      },
      {
        heading: 'Understand version names and version codes',
        paragraphs: [
          'The version name is the human-readable version shown to users, while the version code is an internal numeric identifier used by Android and developers.',
          'Two versions may have similar names but different version codes, so checking both values can help identify a specific release.',
        ],
      },
      {
        heading: 'Check the minimum Android requirement',
        paragraphs: [
          'Before choosing a version, check the minimum Android version required by that release.',
          'A version requiring a newer Android release may not install or work correctly on an older device.',
        ],
      },
      {
        heading: 'Compare version history on DroidZyra',
        paragraphs: [
          'DroidZyra provides version history pages for supported applications so users can review available releases and their requirements.',
          'Use the app directory to find an application and open its version history to compare available versions.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-check-your-android-version',
    title: 'How to Check Which Android Version You Have',
    description:
      'A simple guide to finding the Android version installed on your phone or tablet.',
    category: 'Android Basics',
    readTime: '3 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'Why your Android version matters',
        paragraphs: [
          'Your Android version determines which operating system features and application requirements your device can support.',
          'Checking your Android version is useful when an application shows compatibility warnings or requires a newer operating system.',
        ],
      },
      {
        heading: 'Find the Android version in Settings',
        paragraphs: [
          'Open Settings on your Android device and look for About phone, About device or a similar option.',
          'Depending on the manufacturer, the Android version may be displayed directly or inside a Software information section.',
        ],
      },
      {
        heading: 'Compare your version with an app requirement',
        paragraphs: [
          'After finding your Android version, compare it with the minimum Android requirement of the application you want to use.',
          'If the application requires a newer Android release, you may need to update your device or look for an older compatible version when legitimately available.',
        ],
      },
    ],
  },

  {
    slug: 'why-android-app-may-not-be-compatible',
    title: 'Why an Android App May Not Be Compatible With Your Device',
    description:
      'Understand the most common reasons an Android application may not be compatible with your phone or tablet.',
    category: 'Compatibility',
    readTime: '5 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'Your Android version is too old',
        paragraphs: [
          'One of the most common compatibility problems occurs when an application requires a newer Android version than the device provides.',
          'Developers may increase minimum Android requirements as applications evolve.',
        ],
      },
      {
        heading: 'Hardware requirements',
        paragraphs: [
          'Some applications rely on hardware capabilities such as a camera, GPS, sensors, graphics features or other device capabilities.',
          'If the required hardware is missing or unsupported, the application may not function correctly.',
        ],
      },
      {
        heading: 'Architecture differences',
        paragraphs: [
          'Android devices can use different processor architectures. An application release may support only particular architectures.',
          'Architecture requirements are especially relevant when reviewing application version information outside normal app stores.',
        ],
      },
      {
        heading: 'Application and device restrictions',
        paragraphs: [
          'Developers or distribution platforms can also apply device, region or operating-system restrictions.',
          'If an app appears unavailable, check the official application source and the developer information before assuming that the application itself is broken.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-download-android-apps-safely',
    title: 'How to Safely Download Android Apps',
    description:
      'Learn practical ways to reduce risks when downloading and installing Android applications.',
    category: 'Safe Downloads',
    readTime: '5 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'Prefer official sources',
        paragraphs: [
          'The safest starting point is normally the official app store or the application developer’s official website.',
          'Official sources provide users with a better way to verify the application publisher and obtain legitimate releases.',
        ],
      },
      {
        heading: 'Check the developer',
        paragraphs: [
          'Before installing an application, verify the developer or publisher name and compare it with information provided on the official website.',
          'Be cautious when an application uses a similar name or branding to a well-known application but comes from an unrelated developer.',
        ],
      },
      {
        heading: 'Review permissions',
        paragraphs: [
          'Pay attention to the permissions requested by an application. Consider whether the requested access makes sense for the application’s purpose.',
          'Unexpected or excessive permissions can be a reason to investigate an application further before installation.',
        ],
      },
      {
        heading: 'Avoid pirated and modified applications',
        paragraphs: [
          'Pirated, cracked and modified application packages can introduce security, privacy and reliability risks.',
          'DroidZyra does not host or redistribute pirated, cracked or modified APK files and directs users toward official or authorized sources where available.',
        ],
      },
    ],
  },

  {
    slug: 'how-android-app-versions-work',
    title: 'How Android App Versions Work',
    description:
      'Understand Android app version names, version codes, releases and compatibility requirements.',
    category: 'App Versions',
    readTime: '5 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'What is an app version?',
        paragraphs: [
          'An app version identifies a particular release of an Android application.',
          'Developers publish new versions to add features, fix bugs, improve security or change compatibility requirements.',
        ],
      },
      {
        heading: 'Version name vs version code',
        paragraphs: [
          'The version name is designed for people to understand the release, while the version code is used to distinguish releases internally.',
          'When comparing releases, checking both values provides a clearer picture of which version you are looking at.',
        ],
      },
      {
        heading: 'Release dates and changelogs',
        paragraphs: [
          'Release dates help establish when a particular version became available.',
          'Changelogs can provide additional information about changes made between releases, such as new features, fixes and improvements.',
        ],
      },
      {
        heading: 'Compatibility can change between versions',
        paragraphs: [
          'Different releases of the same application can have different minimum Android requirements.',
          'This is why checking the version history and compatibility information can be useful when an older device cannot use the latest release.',
        ],
      },
    ],
  },

  {
    slug: 'what-is-an-apk',
    title: 'What Is an APK and How Does It Work?',
    description:
      'Learn what an APK file is, what it contains and why Android uses APK packages to install applications.',
    category: 'Android Basics',
    readTime: '4 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'What does APK mean?',
        paragraphs: [
          'APK stands for Android Package Kit. It is a package format used to distribute and install Android applications.',
          'An APK contains application components and information required by Android to install the application.',
        ],
      },
      {
        heading: 'What can an APK contain?',
        paragraphs: [
          'An APK can contain application code, resources, assets, configuration information and a manifest describing important application details.',
          'The package is signed so Android and distribution systems can identify and verify the application publisher and release.',
        ],
      },
      {
        heading: 'Should you download APK files from anywhere?',
        paragraphs: [
          'No. APK files obtained from unknown or untrusted sources can create security and privacy risks.',
          'Whenever possible, use the official app store or the application developer’s official distribution channel.',
        ],
      },
    ],
  },

  {
    slug: 'how-to-check-android-app-version-history',
    title: 'How to Check Android App Version History',
    description:
      'Learn why Android app version history is useful and how to compare previous application releases.',
    category: 'App Versions',
    readTime: '4 min read',
    publishedAt: '2026-08-12',
    updatedAt: '2026-08-12',
    sections: [
      {
        heading: 'What is app version history?',
        paragraphs: [
          'Version history is a record of application releases over time.',
          'It can help users understand how an application has changed and identify releases with different Android requirements.',
        ],
      },
      {
        heading: 'Why compare older versions?',
        paragraphs: [
          'An older release may have different compatibility requirements from the latest version.',
          'Version history can therefore be useful when investigating compatibility problems or understanding when a feature or requirement changed.',
        ],
      },
      {
        heading: 'Use DroidZyra version history',
        paragraphs: [
          'Open the DroidZyra App Directory and select an application to view its available information.',
          'When version history is available, you can review individual releases, requirements and source information from the application pages.',
        ],
      },
    ],
  },
];

export function getGuideBySlug(slug: string): Guide | undefined {
  return guides.find((guide) => guide.slug === slug);
}

export function getGuidesByCategory(category: GuideCategory): Guide[] {
  return guides.filter((guide) => guide.category === category);
}