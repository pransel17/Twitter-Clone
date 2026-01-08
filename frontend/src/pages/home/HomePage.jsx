import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

// since static ito, ito ung main div then inject inject na lang ng content
const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou"); // usestate to trigger React to repaint the screen, para di static yung part ng buttons 

	return (
		<>
			<div className='flex-[4_4_0] mr-auto border-r border-gray-700 min-h-screen'>
				{/* Header */}
				<div className='flex w-full border-b border-gray-700'>
					<div
						className={
							"flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative"
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
					<div
						className='flex justify-center flex-1 p-3 hover:bg-secondary transition duration-300 cursor-pointer relative'
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 w-10  h-1 rounded-full bg-primary'></div>
						)}
					</div>
				</div>

				{/* injecting ung jsx file, hiwalay para efficient */}
				<CreatePost />
				<Posts />
			</div>
		</>
	);
};
export default HomePage;