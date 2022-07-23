
using AutoMapper;
using Backend.DTOs;
using Backend.Entities;
using Backend.Extensions;
using Backend.Interfaces;
using Microsoft.AspNetCore.SignalR;

namespace Backend.SignalR
{
    public class MessageHub : Hub
    {
        private readonly IMapper _mapper;
        private readonly IMessageRepository _messageRepository;
        private readonly IUserRepository _userRepository;
        private readonly IHubContext<PresenceHub> _presenceHub;
        private readonly PresenceTracker _tracker;
        
        // private readonly IUnitOfWork _unitOfWork;

        
        // public MessageHub(IMapper mapper, IUnitOfWork unitOfWork, IHubContext<PresenceHub> presenceHub,
        //     PresenceTracker tracker)
        public MessageHub(IMapper mapper, IMessageRepository messageRepository, 
            IHubContext<PresenceHub> presenceHub, IUserRepository userRepository,
            PresenceTracker tracker)
        {
            // _unitOfWork = unitOfWork;
            _tracker = tracker;
            _presenceHub = presenceHub;
            _messageRepository = messageRepository;
            _mapper = mapper;
            _userRepository = userRepository;
        }

        //227
        public override async Task OnConnectedAsync()
        {
            var httpContext = Context.GetHttpContext();
            var otherUser = httpContext!.Request.Query["user"].ToString();
            var groupName = GetGroupName(Context.User!.GetUserName(), otherUser);
            await Groups.AddToGroupAsync(Context.ConnectionId, groupName);

            // await AddToGroup(groupName);
            var group = await AddToGroup(groupName);
            await Clients.Group(groupName).SendAsync("UpdatedGroup", group);

            var messages = await _messageRepository.GetMessageThread(Context.User!.GetUserName(), otherUser);

            // if (_unitOfWork.HasChanges()) await _unitOfWork.Complete();

            await Clients.Group(groupName).SendAsync("ReceiveMessageThread", messages);
            //await Clients.Caller.SendAsync("ReceiveMessageThread", messages);
        }

        public override async Task OnDisconnectedAsync(Exception? exception)
        {
            // await RemoveFromMessageGroup(Context.ConnectionId);
            var group = await RemoveFromMessageGroup();
            await Clients.Group(group.Name).SendAsync("UpdatedGroup", group);
            await base.OnDisconnectedAsync(exception);
        }

        //228: copy form controller:createMessage
        public async Task SendMessage(CreateMessageDto createMessageDto)
        {
            var username = Context.User!.GetUserName();

            if (username == createMessageDto.RecipientUsername?.ToLower())
                throw new HubException("You cannot send messages to yourself");

            var sender = await _userRepository.GetUserByUsernameAsync(username);
            var recipient = await _userRepository.GetUserByUsernameAsync(createMessageDto.RecipientUsername!);

            if (recipient == null) throw new HubException("Not found user");

            var message = new Message
            {
                Sender = sender,
                Recipient = recipient,
                SenderUsername = sender.UserName,
                RecipientUsername = recipient.UserName,
                Content = createMessageDto.Content
            };

            // _messageRepository.AddMessage(message);

            // if (await _messageRepository.SaveAllAsync()) {
            //     var groupName = GetGroupName(sender.UserName, recipient.UserName);
            //     await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            // }
            
            var groupName = GetGroupName(sender.UserName, recipient.UserName);

            var group = await _messageRepository.GetMessageGroup(groupName);

            if (group.Connections.Any(x => x.UserName == recipient.UserName))
            {
                message.DateRead = DateTime.UtcNow;
            }
            else
            {
                //235. Notifying users when receive a message
                var connections = await _tracker.GetConnectionsForUser(recipient.UserName);
                if (connections != null)
                {
                    await _presenceHub.Clients.Clients(connections).SendAsync("NewMessageReceived",
                        new { username = sender.UserName, knownAs = sender.KnownAs });
                }
             }

            _messageRepository.AddMessage(message);

            if (await _messageRepository.SaveAllAsync()) {
                await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
            }

        //     _unitOfWork.MessageRepository.AddMessage(message);

        //     if (await _unitOfWork.Complete())
        //     {
        //         await Clients.Group(groupName).SendAsync("NewMessage", _mapper.Map<MessageDto>(message));
        //     }
        }

        // private async Task<bool> AddToGroup(HubCallerContext context, string groupName)
        private async Task<Group> AddToGroup(string groupName)
        {
            var group = await _messageRepository.GetMessageGroup(groupName);
            var connection = new Connection(Context.ConnectionId, Context.User!.GetUserName());

            if (group == null)
            {
                group = new Group(groupName);
                _messageRepository.AddGroup(group);
            }

            group.Connections.Add(connection);

            // return await _messageRepository.SaveAllAsync();
            if(await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to join group");
        }

        private async Task<Group> RemoveFromMessageGroup(){
            // var connection = await _messageRepository.GetConnection(Context.ConnectionId);

            var group = await _messageRepository.GetGroupForConnection(Context.ConnectionId);
            var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
            _messageRepository.RemoveConnection(connection!);
            if(await _messageRepository.SaveAllAsync()) return group;

            throw new HubException("Failed to remove from group");
        }

        // private async Task<Group> RemoveFromMessageGroup()
        // {
        //     var group = await _unitOfWork.MessageRepository.GetGroupForConnection(Context.ConnectionId);
        //     var connection = group.Connections.FirstOrDefault(x => x.ConnectionId == Context.ConnectionId);
        //     _unitOfWork.MessageRepository.RemoveConnection(connection);
        //     if (await _unitOfWork.Complete()) return group;

        //     throw new HubException("Failed to remove from group");
        // }

        private string GetGroupName(string caller, string other)
        {
            var stringCompare = string.CompareOrdinal(caller, other) < 0;
            return stringCompare ? $"{caller}-{other}" : $"{other}-{caller}";
        }
    }
}