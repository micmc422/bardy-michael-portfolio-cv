import { IconType } from "react-icons";

import {
  HiChevronUp,
  HiChevronDown,
  HiChevronRight,
  HiChevronLeft,
  HiArrowUpRight,
  HiOutlineArrowPath,
  HiCheck,
  HiMiniQuestionMarkCircle,
  HiMiniXMark,
  HiOutlineLink,
  HiExclamationTriangle,
  HiInformationCircle,
  HiExclamationCircle,
  HiCheckCircle,
  HiMiniGlobeAsiaAustralia,
  HiArrowTopRightOnSquare,
  HiEnvelope,
  HiCalendarDays,
  HiClipboard,
  HiArrowRight,
  HiOutlineEye,
  HiOutlineEyeSlash,
  HiMoon,
  HiSun,
  HiOutlineDocument,
  HiOutlinePencilSquare,
  HiOutlineExclamationTriangle,
  HiOutlineArrowTopRightOnSquare,
  HiUsers,
  HiCodeBracket,
  HiOutlineStar,
  HiOutlineFaceSmile
} from "react-icons/hi2";

import { GoRepoForked } from "react-icons/go";


import {
  PiHouseDuotone,
  PiUserCircleDuotone,
  PiGridFourDuotone,
  PiBookBookmarkDuotone,
  PiImageDuotone,
} from "react-icons/pi";

import { FaDiscord, FaGithub, FaX } from "react-icons/fa6";
import { FiFacebook, FiLinkedin, FiTwitter } from "react-icons/fi";
import { RxCookie } from "react-icons/rx";
import { MdNotificationsNone, MdOutlineNotificationsOff, MdOutlineNotificationsActive } from "react-icons/md";

export const iconLibrary: Record<string, IconType> = {
  notifNone: MdNotificationsNone,
  notifOff: MdOutlineNotificationsOff,
  notifOn: MdOutlineNotificationsActive,
  facebook: FiFacebook,
  twitter: FiTwitter,
  linkedin: FiLinkedin,
  repondre: HiOutlinePencilSquare,
  chevronUp: HiChevronUp,
  chevronDown: HiChevronDown,
  chevronRight: HiChevronRight,
  chevronLeft: HiChevronLeft,
  refresh: HiOutlineArrowPath,
  arrowUpRight: HiArrowUpRight,
  check: HiCheck,
  arrowRight: HiArrowRight,
  helpCircle: HiMiniQuestionMarkCircle,
  infoCircle: HiInformationCircle,
  warningTriangle: HiExclamationTriangle,
  errorCircle: HiExclamationCircle,
  checkCircle: HiCheckCircle,
  email: HiEnvelope,
  globe: HiMiniGlobeAsiaAustralia,
  person: PiUserCircleDuotone,
  grid: PiGridFourDuotone,
  book: PiBookBookmarkDuotone,
  close: HiMiniXMark,
  openLink: HiOutlineLink,
  calendar: HiCalendarDays,
  home: PiHouseDuotone,
  gallery: PiImageDuotone,
  discord: FaDiscord,
  eye: HiOutlineEye,
  eyeOff: HiOutlineEyeSlash,
  github: FaGithub,
  x: FaX,
  clipboard: HiClipboard,
  arrowUpRightFromSquare: HiArrowTopRightOnSquare,
  moon: HiMoon,
  sun: HiSun,
  document: HiOutlineDocument,
  danger: HiOutlineExclamationTriangle,
  linkblank: HiOutlineArrowTopRightOnSquare,
  users: HiUsers,
  star: HiOutlineStar,
  gitfork: GoRepoForked,
  code: HiCodeBracket,
  smile: HiOutlineFaceSmile,
  cookie: RxCookie
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;