import Image from 'next/image';

const SocialIcons = [
  {
    id: 475656,
    label: 'Google',
    icon: 'google-color',
  },
  // {
  //   id: 452062,
  //   label: 'Microsoft',
  //   icon: 'microsoft',
  // },
  // {
  //   id: 475633,
  //   label: 'Apple',
  //   icon: 'apple-color',
  // },
  {
    id: 475647,
    label: 'Facebook',
    icon: 'facebook-color',
  },
  // {
  //   id: 512317,
  //   label: 'Github',
  //   icon: 'github-142',
  // },
] as const;

const SocialAuth = () => {
  const handleClick = (label: string) => {
    if (label === 'Google') {
      console.log(label);
    } else if (label === 'Facebook') {
      console.log(label);
    }
  };

  return (
    <>
      {SocialIcons.map((authIcon) => (
        <button
          type='button'
          className='my-2 flex h-14 w-full items-center gap-2 rounded-sm border border-slate-200 px-4 py-2 text-slate-700 transition duration-150 hover:bg-gray-200/40 hover:text-slate-900 dark:border-slate-700 dark:text-gray-400 dark:hover:bg-gray-700/40'
          key={authIcon.id}
          onClick={() => handleClick(authIcon.label)}
        >
          <Image
            height={32}
            width={32}
            className='h-6 w-6'
            src={`https://www.svgrepo.com/show/${authIcon.id}/${authIcon.icon}.svg`}
            loading='lazy'
            alt={`${authIcon.label} logo`}
          />
          <span>Continue with {authIcon.label}</span>
        </button>
      ))}
    </>
  );
};

export default SocialAuth;
