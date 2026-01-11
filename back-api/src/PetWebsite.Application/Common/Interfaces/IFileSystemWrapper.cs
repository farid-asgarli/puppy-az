namespace PetWebsite.Application.Common.Interfaces;

/// <summary>
/// Abstraction over file system operations for better testability.
/// Follows Dependency Inversion Principle.
/// </summary>
public interface IFileSystemWrapper
{
	/// <summary>
	/// Checks if a directory exists.
	/// </summary>
	bool DirectoryExists(string path);

	/// <summary>
	/// Creates a directory and all necessary parent directories.
	/// </summary>
	void CreateDirectory(string path);

	/// <summary>
	/// Checks if a file exists.
	/// </summary>
	bool FileExists(string path);

	/// <summary>
	/// Deletes a file.
	/// </summary>
	void DeleteFile(string path);

	/// <summary>
	/// Opens a file for reading.
	/// </summary>
	Stream OpenRead(string path);

	/// <summary>
	/// Creates a new file for writing.
	/// </summary>
	Stream CreateFile(string path);

	/// <summary>
	/// Gets file information.
	/// </summary>
	FileInfo GetFileInfo(string path);

	/// <summary>
	/// Gets the full path for a given path.
	/// </summary>
	string GetFullPath(string path);

	/// <summary>
	/// Combines path components into a single path.
	/// </summary>
	string CombinePaths(params string[] paths);
}
