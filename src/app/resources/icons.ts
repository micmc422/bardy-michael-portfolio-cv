import type { IconType } from "react-icons";

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
    HiOutlineFaceSmile,
    HiStar,
    HiOutlineMagnifyingGlass,
    HiBriefcase,
    HiShoppingCart,
    HiArrowRightCircle
} from "react-icons/hi2";

import { GoRepoForked } from "react-icons/go";
import { IoIosConstruct } from "react-icons/io";
import { IoAtOutline, IoFastFoodOutline, IoFlagOutline, IoFootballOutline, IoGiftOutline, IoGlobeOutline, IoImages, IoPawOutline, IoPencil, IoSettingsOutline, IoShieldCheckmark, IoSparkles } from "react-icons/io5";
import { SiFigma, SiNodedotjs, SiTypescript, SiNextdotjs, SiPrisma } from "react-icons/si";

import {
    PiHouseDuotone,
    PiUserCircleDuotone,
    PiGridFourDuotone,
    PiBookBookmarkDuotone,
    PiImageDuotone,
    PiPaletteBold,
    PiDeviceMobile,
    PiUpload,
    PiLightbulbDuotone,
} from "react-icons/pi";

import { FaDiscord, FaEuroSign, FaGithub, FaX, FaMapPin, FaHandshake, FaChartLine } from "react-icons/fa6";
import { FiBarChart2, FiFacebook, FiFilter, FiLayout, FiLinkedin, FiPackage, FiShare2, FiTrendingUp, FiTruck, FiTwitter, FiZap } from "react-icons/fi";
import { RxCookie } from "react-icons/rx";
import { MdNotificationsNone, MdOutlineNotificationsOff, MdOutlineNotificationsActive } from "react-icons/md";
import { ChevronsLeftRight } from "lucide-react";

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
    starfill: HiStar,
    gitfork: GoRepoForked,
    code: HiCodeBracket,
    smile: HiOutlineFaceSmile,
    search: HiOutlineMagnifyingGlass,
    smiley: HiOutlineFaceSmile,
    paw: IoPawOutline,
    food: IoFastFoodOutline,
    ball: IoFootballOutline,
    world: IoGlobeOutline,
    gift: IoGiftOutline,
    symbol: IoAtOutline,
    flag: IoFlagOutline,
    cookie: RxCookie,
    briefcase: HiBriefcase,
    shoppingCart: HiShoppingCart,
    palette: PiPaletteBold,
    mobile: PiDeviceMobile,
    shield: IoShieldCheckmark,
    euro: FaEuroSign,
    construction: IoIosConstruct,
    images: IoImages,
    zap: FiZap,
    settings: IoSettingsOutline,
    share2: FiShare2,
    "bar-chart-2": FiBarChart2,
    "chart-line": FaChartLine,
    pen: IoPencil,
    upload: PiUpload,
    sparkles: IoSparkles,
    lightbulb: PiLightbulbDuotone,
    package: FiPackage,
    "arrow-right-circle": HiArrowRightCircle,
    truck: FiTruck,
    filter: FiFilter,
    "trending-up": FiTrendingUp,
    layout: FiLayout,
    pin: FaMapPin,
    handshake: FaHandshake,
    chevronsLeftRight: ChevronsLeftRight,
    figma: SiFigma,
    nodejs: SiNodedotjs,
    typescript: SiTypescript,
    nextjs: SiNextdotjs,
    prisma: SiPrisma
};

export type IconLibrary = typeof iconLibrary;
export type IconName = keyof IconLibrary;

// Once UI 2.0 type `Icon.name` as a real union (`IconName`), so every custom
// icon name must be declared here or `tsc` rejects it. Keep this in sync with
// `iconLibrary` above.
declare module "@once-ui-system/core" {
    interface IconLibraryOverrides {
        notifNone: true;
        notifOff: true;
        notifOn: true;
        facebook: true;
        twitter: true;
        linkedin: true;
        repondre: true;
        chevronUp: true;
        chevronDown: true;
        chevronRight: true;
        chevronLeft: true;
        refresh: true;
        arrowUpRight: true;
        check: true;
        arrowRight: true;
        helpCircle: true;
        infoCircle: true;
        warningTriangle: true;
        errorCircle: true;
        checkCircle: true;
        email: true;
        globe: true;
        person: true;
        grid: true;
        book: true;
        close: true;
        openLink: true;
        calendar: true;
        home: true;
        gallery: true;
        discord: true;
        eye: true;
        eyeOff: true;
        github: true;
        x: true;
        clipboard: true;
        arrowUpRightFromSquare: true;
        moon: true;
        sun: true;
        document: true;
        danger: true;
        linkblank: true;
        users: true;
        star: true;
        starfill: true;
        gitfork: true;
        code: true;
        smile: true;
        search: true;
        smiley: true;
        paw: true;
        food: true;
        ball: true;
        world: true;
        gift: true;
        symbol: true;
        flag: true;
        cookie: true;
        briefcase: true;
        shoppingCart: true;
        palette: true;
        mobile: true;
        shield: true;
        euro: true;
        construction: true;
        images: true;
        zap: true;
        settings: true;
        share2: true;
        "bar-chart-2": true;
        "chart-line": true;
        pen: true;
        upload: true;
        sparkles: true;
        lightbulb: true;
        package: true;
        "arrow-right-circle": true;
        truck: true;
        filter: true;
        "trending-up": true;
        layout: true;
        pin: true;
        handshake: true;
        chevronsLeftRight: true;
        figma: true;
        nodejs: true;
        typescript: true;
        nextjs: true;
        prisma: true;
    }
}