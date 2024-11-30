import { LoadingCards } from "./components/loading-cards";

export default function Loading() {
    return (
        <div className="flex flex-1 items-center justify-center w-full h-full">
            <div aria-label="Orange and tan hamster running in a metal wheel" role="img" className="wheel-and-hamster opacity-50">
                <div className="wheel"></div>
                <div className="hamster">
                    <div className="hamster__body">
                        <div className="hamster__head">
                            <div className="hamster__ear"></div>
                            <div className="hamster__eye"></div>
                            <div className="hamster__nose"></div>
                        </div>
                        <div className="hamster__limb hamster__limb--fr"></div>
                        <div className="hamster__limb hamster__limb--fl"></div>
                        <div className="hamster__limb hamster__limb--br"></div>
                        <div className="hamster__limb hamster__limb--bl"></div>
                        <div className="hamster__tail"></div>
                    </div>
                </div>
                <div className="spoke"></div>
            </div>
        </div>
    )
}