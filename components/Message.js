const Message = ({ children, avatar, username, description }) => {
	return (
    <div className="bg-white p-8 border-b-2 rounded-lg shadow-xl shadow-blue-500 hover:shadow-blue-600">
			<div className="flex items-center gap-2">
				<img src={avatar} className="w-10 rounded-full" />
				<h2 className=''>{username}</h2>
			</div>
			<div className="py-4">
				<p className='text-sm'>{description}</p>
			</div>
      <div className='text-xs text-gray-500'>
			{children}
      </div>
		</div>
	);
};

export default Message;
