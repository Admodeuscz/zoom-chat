import React from 'react';
import { Link } from "react-router-dom";

//carousel
import AliceCarousel from 'react-alice-carousel'
import 'react-alice-carousel/lib/alice-carousel.css'

//store
import useStoreChat from '../../../store/useStoreChat'
import { genAvatar } from '../../../utils/utils'

//Import Images
const OnlineUsers = () => {
    const responsive = {
        0: { items: 4 },
        1024: { items: 4 },
    }

    const onlineUsers = useStoreChat((state) => state?.onlineUsers) ?? []
    return (
        <React.Fragment>
            {/* Start user status */}
            <div className="px-4 pb-4 dot_remove" dir="ltr" >
                <AliceCarousel
                    responsive={responsive}
                    disableDotsControls={false}
                    disableButtonsControls={false}
                    mouseTracking

                >
                    {
                        onlineUsers.map((onlineUser) => (
                            <div className="item" key={onlineUser.op_id}>
                                <Link className="user-status-box cursor-pointer">
                                    <div className="avatar-xs mx-auto d-block chat-user-img online">
                                        <span className="avatar-title rounded-circle bg-primary-subtle text-primary">
                                            {genAvatar(onlineUser.op_name)}
                                        </span>
                                        <span className="user-status"></span>
                                    </div>

                                    <h5 className="font-size-13 text-truncate mt-3 mb-1">{onlineUser.op_name}</h5>
                                </Link>
                            </div>
                        ))
                    }
                </AliceCarousel>
                {/* end user status carousel */}
            </div>
            {/* end user status  */}
        </React.Fragment>
    );
}

export default OnlineUsers;