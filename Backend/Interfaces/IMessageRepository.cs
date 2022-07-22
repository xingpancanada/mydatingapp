using API.Helpers;
using Backend.DTOs;
using Backend.Entities;
using Backend.Helpers;

namespace Backend.Interfaces
{
    ////184
    public interface IMessageRepository
    {
        void AddMessage(Message message);
        void DeleteMessage(Message message);
        Task<Message> GetMessage(int id);

        // Task<PagedList<MessageDto>> GetMessagesForUser();
        Task<PagedList<MessageDto>> GetMessagesForUser(MessageParams messageParams);


        // Task<IEnumerable<MessageDto>> GetMessageThread(int currentUserId, int recipientId);
        Task<IEnumerable<MessageDto>> GetMessageThread(string currentUsername, string recipientUsername);
        Task<bool> SaveAllAsync();


        void AddGroup(Group group);
        void RemoveConnection(Connection connection);
        Task<Connection> GetConnection(string connectionId);
        Task<Group> GetMessageGroup(string groupName);
        Task<Group> GetGroupForConnection(string connectionId);
    }
}