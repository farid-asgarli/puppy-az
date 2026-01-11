using PetWebsite.Application.Common.Interfaces;

namespace PetWebsite.Infrastructure.Services.Files;

/// <summary>
/// Default implementation of file system operations wrapper.
/// </summary>
public class FileSystemWrapper : IFileSystemWrapper
{
	public bool DirectoryExists(string path) => Directory.Exists(path);

	public void CreateDirectory(string path) => Directory.CreateDirectory(path);

	public bool FileExists(string path) => File.Exists(path);

	public void DeleteFile(string path) => File.Delete(path);

	public Stream OpenRead(string path) =>
		new FileStream(path, FileMode.Open, FileAccess.Read, FileShare.Read, bufferSize: 4096, useAsync: true);

	public Stream CreateFile(string path) =>
		new FileStream(path, FileMode.Create, FileAccess.Write, FileShare.None, bufferSize: 4096, useAsync: true);

	public FileInfo GetFileInfo(string path) => new(path);

	public string GetFullPath(string path) => Path.GetFullPath(path);

	public string CombinePaths(params string[] paths) => Path.Combine(paths);
}
